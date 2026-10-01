// EmployeeManagement.js
import React, { useEffect, useState } from 'react';
import '../../assets/css/admin/employee.css';
import { apiFetch } from '../../api/base'; 
import { denyAndRedirect } from '../../utils/notify';

const AdminEmployee: React.FC = () => {
  const [employees, setEmployees] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<any>('');
  const [editingEmployee, setEditingEmployee] = useState<any>('');
  const [showModel, setShowModel] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: "",
    phone: "",
    email: "",
    username: "",
    role: "STAFF",
    password: 123456,
    status: "ACTIVE",
    createAt : new Date(),
    updateAt : new Date(),
  })

  // const api = 'http://localhost:8080'
  const token = localStorage.getItem("token");
  const rolee = localStorage.getItem("role");

  useEffect(() => {
    if (rolee !== 'ADMIN' || !token) {
      denyAndRedirect();
      return;
    }
    fetchEmployee();
  }, [])
  const filteredEmployees = employees.filter((employee: any) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const status = [
    {id: "ACTIVE", name: "Đang làm"},
    {id: "INACTIVE", name: "Nghỉ việc"},
  ]

  const role = [
    {id: "ADMIN", name:"Quản trị"},
    {id: "MANAGER", name:"Quản lí"},
    {id: "STAFF", name:"Nhân viên"}
  ]


  const fetchEmployee = async () => {
    try {
      const res = await apiFetch(`/api/employees/admin`)
      const data = await res.json();
      if(data) {
        setEmployees(data);
      }
    } catch (err) {
      console.log(err)
    }
  }
  const handleSetAddEmployee = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      username: '',
      role: "STAFF",
      password: 123456,
      status: "ACTIVE",
    });
    setShowModel(true);
  }

  const handleSetEditEmployee = (employee: any) => {
    console.log(employee)
    setEditingEmployee(employee)
    setFormData({
      name: employee.name,
      phone: employee.phone,
      email: employee.email,
      username: employee.username,
      role: "STAFF",
      password: 123456,
      status: "ACTIVE",
    })
    // Xử lý chỉnh sửa nhân viên
    setShowModel(true);
  };

  const handleAdd = async (e: any) => {
    e.preventDefault();
    console.log(JSON.stringify(formData ,null, 2))
    try {
      const res = await apiFetch(`/api/employees/admin`, {
        method: "POST",
        body: JSON.stringify(formData)
      });
      if(res.ok) {
        const data = await res.json();
        setEmployees((pred: any) => [...pred, data])
        setShowModel(false);
      }
    } catch (err) {
      console.log(err)
    }
  } 

  const handleEdit = async (e: any) => {
    e.preventDefault();
    console.log(JSON.stringify(formData ,null, 2))
    try {
      const res = await apiFetch(`/api/employees/admin/${editingEmployee.id}`, {
        method: "PUT",
        body: JSON.stringify(formData)
      });
      if (res.ok) {
      const data = await res.text(); 
      console.log(data)
      const updatedEmployee = JSON.parse(data);
      setEmployees((prev: any) =>
        prev.map((emp: any) =>
          emp.id === editingEmployee.id ? { ...emp, ...updatedEmployee } : emp
        )
      );
        setShowModel(false);
      }
    } catch (err) {
      console.log(err)
    }
  } 

  const handleDelete = async (id: any) => {
    if (!window.confirm('Bạn có chắc muốn xóa ...?')) return;
    try {
      const res = await apiFetch(`/api/employees/admin/${id}`, {
        method: 'DELETE',
         headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      if(res.ok) {
        setEmployees((pre: any) => pre.filter((e: any) => e.id !== id));
      }
    } catch (err) {
      console.log(err)
    }
  };

  const handleClose = () => {
    setShowModel(false);
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value
    }));
  }



  const formatDateTime = (dateTime: string) =>
    new Date(dateTime).toLocaleString("vi-VN");

  return (
    <div className="employee-management">
      {/* Header */}
      <div className="header-employee">
        <h1>Quản Lý Nhân Viên</h1>
        <p>Quản lý thông tin nhân viên một cách hiệu quả và chuyên nghiệp</p>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên theo tên, chức vụ, phòng ban..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="actions">
          <button className="btn btn-primary" onClick={handleSetAddEmployee}>
            <span>+</span> Thêm Nhân Viên
          </button>
        </div>
      </div>

      {/* Employee Table */}
      <div className="employee-table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Họ Tên</th>
              <th>Chức Vụ</th>
              <th>Email</th>
              <th>Số Điện Thoại</th>
              <th>Trạng Thái</th>
              <th>Ngày Vào Làm</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee: any) => (
              <tr key={employee.id}>
                <td>
                  <div style={{ fontWeight: '500' }}>{employee.name}</div>
                </td>
                <td>{employee.role}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>
                  <span className={`status-badge ${employee.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>
                    {employee.status === 'ACTIVE' ? 'Đang làm' : 'Nghỉ việc'}
                  </span>
                </td>
                <td>{formatDateTime(employee.createdAt)}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon btn-edit"
                      onClick={() => handleSetEditEmployee(employee)}
                      title="Chỉnh sửa"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(employee.id)}
                      title="Xóa"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Thống kê */}
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: 'var(--white)', 
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(75, 59, 43, 0.08)'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: 'var(--olive-green)' 
            }}>
              {employees.length}
            </div>
            <div style={{ color: 'var(--deep-brown)' }}>Tổng Nhân Viên</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: 'var(--olive-green)' 
            }}>
              {employees.filter((emp: any) => emp.status === 'ACTIVE').length}
            </div>
            <div style={{ color: 'var(--deep-brown)' }}>Đang Làm Việc</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: 'var(--red-brown)' 
            }}>
              {employees.filter((emp: any)  => emp.status === 'INACTIVE').length}
            </div>
            <div style={{ color: 'var(--deep-brown)' }}>Đã Nghỉ Việc</div>
          </div>
        </div>
      </div>
      {showModel && (
      <div className="product-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">
              {editingEmployee ? 'Chỉnh sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
            </h2>
            <button className="close-btn" onClick={handleClose}>×</button>
          </div>

          <form className="product-form" onSubmit={editingEmployee ? (handleEdit) : (handleAdd)}>
            <div className="form-group full-width">
              <label className="form-label required">Họ và tên</label>
              <input
                type="text"
                className="form-input"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label required">Tên đăng nhập</label>
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
              <label className="form-label required">Chức vụ</label>
              <select
                className="form-select"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                {role?.filter(r => r.id !== 'all').map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label required">Trạng thái</label>
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                {status?.filter(s => s.id !== 'all').map(status => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label required">Email</label>
              <input
                type="text"
                className="form-input"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input
                type="text"
                className="form-input"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={handleClose}>
                Hủy
              </button>
              <button type="submit" className="save-btn">
                {editingEmployee ? 'Cập nhật' : 'Thêm nhân viên'}
              </button>
            </div>
          </form>
        </div>
      </div>
      )}
    </div>


  );
};

export default AdminEmployee;