// AdminUsers.js
import React, { useState, useEffect } from 'react';
import '../../assets/css/admin/user.css';


const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState<any>('');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    search: ''
  });
  const api = 'http://localhost:8080'
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [formData, setFormData] = useState<any>([
    {
    username: "",
    phone: "",
    email: "",
    enabled: true,
    role: "USER",
    password: 123456,
    credentialsNonExpired: true,
    accountNonExpired: true,
    accountNonLocked: true,
    createAt : new Date(),
    updateAt : new Date(),
  }
  ]);

  const roles = [
    { id: 'ADMIN', name: 'Quản trị viên'},
    { id: 'USER', name: 'Khách hàng' },
    { id: 'BANNER', name: 'Khóa tài khoản' },
  ];

  const statuses = [
    { id: 'all', name: 'Tất cả trạng thái' },
    { id: 'active', name: 'Hoạt động' },
    { id: 'inactive', name: 'Không hoạt động' },
    { id: 'banned', name: 'Đã khóa' }
  ];

  useEffect(() => {
    if (role !== 'ADMIN' || !token) {
      alert('Bạn không có quyền truy cập trang này!');
      window.location.href = '/';
    };
    fetchUser();
  }, []);

  const filteredUsers = users.filter((user: any) =>
    user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.role?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const fetchUser = async () => {
    try {
    const res = await fetch(`${api}/api/users/admin`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    const data = await res.json();
    if(data) {
      setUsers(data);
    }
    } catch (err) {
      console.log(err)
    }
  }


  const handleFilterChange = (key: any, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSetAddUser = () => {
    setEditingUser(null);
    setFormData({
      username: "",
      phone: "",
      email: "",
      role: "USER",
      password: "123456",
      createAt : new Date(),
      updateAt : new Date(),
    })
    setShowModal(true);
  };

  const handleAddEditUser = (user: any) => {
    setEditingUser(user);
      setFormData({
      username: user.username,
      phone: user.phone,
      email: user.email,
      role: user.role,
      password: "123456",
      createAt : new Date(),
      updateAt : new Date(),
    })
    setShowModal(true);
  };

  const handleAddUser = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`${api}/api/users/register`,{
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
      const data = await res.json();
      setUsers((pre: any) => [...pre, data]);
      setShowModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

    const handleUpdateUser = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`${api}/api/users/admin/${editingUser.id}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
      const data = await res.json();
      console.log("data", data)
      setUsers((pre: any) => 
        pre.map((e: any) => e.id === editingUser.id ? {...e, ...data} : e)
        );
      setShowModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleClose = () => {
    setShowModal(false);
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData((prev: any) => ({
          ...prev,
          image: ev.target?.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBanUser = async (id: any) => {
    try {
      const res = await fetch(`${api}/api/users/admin/${id}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({role: "BANNER"})
      });
      if (res.ok) {
      const data = await res.json();
      console.log("data", data)
      setUsers((pre: any) => 
        pre.map((e: any) => e.id === id ? {...e, ...data} : e)
        );
      setShowModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnbanUser = async (id: any) => {
    try {
      const res = await fetch(`${api}/api/users/admin/${id}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({role: "USER"})
      });
      if (res.ok) {
      const data = await res.json();
      console.log("data", data)
      setUsers((pre: any) => 
        pre.map((e: any) => e.id === id ? {...e, ...data} : e)
        );
      setShowModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteUser = async (id: any) => {
    window.confirm('Bạn có chắc muốn xóa tài khoản này?')
    try {
      const res = await fetch(`${api}/api/users/admin/${id}`, {
        method: 'DELETE',
         headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      if(res.ok) {
        setUsers((pre: any) => pre.filter((e: any) => e.id !== id));
      }
    } catch (err) {
      console.log(err)
    }    
  };

  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: any) => {
    if (!dateString) return 'Chưa đăng nhập';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getInitials = (username: any) => {
    return username?.split(' ').map((word: any) => word[0]).join('').toUpperCase();
  };

  return (
    <div className="admin-users">
        <main className="dashboard-main">
          <div className="users-main">
            <div className="users-header">
              <h2 className="users-title">Quản Lý Người Dùng</h2>
              <div className="users-actions">
                <button className="export-btn">
                  📤 Xuất Excel
                </button>
                <button className="add-user-btn" onClick={handleSetAddUser}>
                  ➕ Thêm Người Dùng
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="users-filter">
              <div className="filter-group">
                <label className="filter-label">Vai trò</label>
                <select 
                  className="filter-select"
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Trạng thái</label>
                <select 
                  className="filter-select"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  {statuses.map(status => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Tìm kiếm</label>
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Tìm kiếm nhân viên theo tên, vai trò,..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Users Table */}
            {filteredUsers.length > 0 ? (
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Người Dùng</th>
                      <th>Thống Kê</th>
                      <th>Vai Trò</th>
                      <th>Thông tin</th>
                      <th>Lần Đăng Nhập Cuối</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user:any) => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-avatar">
                            <div className="avatar-image">
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.username} />
                              ) : (
                                getInitials(user.username)
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="user-stats">
                            <div className="stat-value">{user.orders} đơn</div>
                            <div className="stat-label">{formatPrice(user.totalSpent)}</div>
                          </div>
                        </td>
                        <td>
                          <span className={`user-role role-${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                            <div className="user-info">
                              <div className="user-name">{user.username}</div>
                              <div className="user-email">{user.email}</div>
                              <div className="user-email">{user.phone}</div>
                            </div>
                        </td>
                        <td>
                          {formatDate(user.lastLogin)}
                        </td>
                        <td>
                          <div className="user-actions">
                            <button 
                              className="action-btn edit-btn"
                              onClick={() => handleAddEditUser(user)}
                            >
                              ✏️ Sửa
                            </button>
                            {user.role === 'BANNER' ? (
                              <button 
                                className="action-btn unban-btn"
                                onClick={() => handleUnbanUser(user.id)}
                              >
                                🔓 Mở khóa
                              </button>
                            ) : (
                              <button 
                                className="action-btn ban-btn"
                                onClick={() => handleBanUser(user.id)}
                              >
                                🔒 Khóa
                              </button>
                            )}
                            <button 
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              🗑️ Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-users">
                <div className="empty-icon">👥</div>
                <h3 className="empty-title">Không tìm thấy người dùng</h3>
                <p className="empty-description">
                  {filters.search || filters.role !== 'all' || filters.status !== 'all'
                    ? 'Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm'
                    : 'Hãy thêm người dùng đầu tiên vào hệ thống'
                  }
                </p>
                <button className="add-user-btn" onClick={handleSetAddUser}>
                  ➕ Thêm Người Dùng Đầu Tiên
                </button>
              </div>
            )}
          </div>
        </main>
     
      {showModal && (
      <div className="product-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">
              {editingUser ? 'Chỉnh sửa thông tin người dùng' : 'Thêm người dùng Mới'}
            </h2>
            <button className="close-btn" onClick={handleClose}>×</button>
          </div>

          <form className="product-form" onSubmit={editingUser ? (handleUpdateUser) : (handleAddUser)}>
            <div className="form-group full-width">
              <label className="form-label required">Họ và tên</label>
              <input
                type="text"
                className="form-input"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Trạng thái</label>
              <select
                className="form-select"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                {roles.filter(r => r.id !== 'all').map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label required">email</label>
              <input
                type="text"
                className="form-input"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">phone</label>
              <input
                type="text"
                className="form-input"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Hình ảnh</label>
              <div className="image-upload">
                <div className="image-preview">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <div>📷</div>
                      <div>Chưa có hình ảnh</div>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="image-upload" className="upload-btn">
                  Chọn hình ảnh
                </label>
              </div>
            </div>


            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={handleClose}>
                Hủy
              </button>
              <button type="submit" className="save-btn">
                {editingUser ? 'Cập nhật' : 'Thêm sản phẩm'}
              </button>
            </div>
          </form>
        </div>
      </div>
      )}
    </div>
  );
};


export default AdminUsers;