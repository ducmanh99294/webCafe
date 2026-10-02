import { useState, useEffect } from 'react';
import '../../assets/css/user/profile.css';
import { apiFetch } from '../../api/base'; 
import { notify } from '../../utils/notify';
import Loading from '../Loading';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>({
    username: '',
    email: '',
    phone: '',
    image: ''
  });
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchuser();
    const interval = setInterval(fetchuser, 5000);
    return () => clearInterval(interval);
  }, []);

  const navigationItems = [
    { id: 'personal', label: 'Thông tin cá nhân', icon: '👤' },
  ];

  const fetchuser = async () => {
    try{
      const res = await apiFetch(`/api/users/${userId}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setUser(data);
      // setFormData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally { setLoading(false); }
  };
  const setDataUpdate = (data: any) => {
    setIsEditing(true);
    setFormData({
      username: data.username,
      email: data.email,
      phone: data.phone,
      image: data.image || ''
    });
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      const res = await apiFetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setUser(formData)
      }
      notify.success('Information updated successfully!');
    } catch (error) {
      console.error('Error updating user data:', error);
      notify.error('Information updated failed!');
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };
  
  const handleAvatarChange = (e: any) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        setFormData((prev: any) => ({
          ...prev,
          avatar: typeof result === 'string' ? result : ''
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">Hồ Sơ Cá Nhân</h1>
        <p className="profile-subtitle">
          Quản lý thông tin tài khoản và tùy chỉnh trải nghiệm của bạn
        </p>
      </div>
      {loading ? <Loading /> : (
        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            {/* User Card */}
            <div className="user-card">
              <div className="user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="avatar-image" />
                ) : (
                  <div className="avatar-placeholder">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h3 className="user-name">{user.name}</h3>
              <p className="user-email">{user.email}</p>
              <p className="user-member-since">
                Thành viên từ {formatDate(user.createdAt)}
              </p>
            </div>

            {/* Navigation */}
            <nav className="profile-nav">
              {navigationItems.map(item => (
                <div
                  key={item.id}
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </div>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="profile-main">
            <div className="profile-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">Thông tin cá nhân</h2>
                <p className="section-subtitle">Quản lý thông tin cá nhân và tài khoản của bạn</p>
              </div>
              {!isEditing && (
                <button className="edit-btn" onClick={() => setDataUpdate(user)}>
                  Chỉnh sửa
                </button>
              )}
            </div>

            {isEditing ? (
              <form className="profile-form">
                <div className="form-group full-width">
                  <label className="form-label">Ảnh đại diện</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div className="user-avatar">
                      {formData.avatar ? (
                        <img src={formData.avatar} alt="Avatar" className="avatar-image" />
                      ) : (
                        <div className="avatar-placeholder">
                          {formData.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <label className="avatar-upload" title="Đổi ảnh">
                        📷
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </div>
                    <div>
                      <p style={{ color: '#4B3B2B', marginBottom: '8px' }}>Tải lên ảnh đại diện mới</p>
                      <p style={{ color: 'rgba(75, 59, 43, 0.7)', fontSize: '0.9rem' }}>
                        JPG, PNG định dạng được hỗ trợ. Kích thước tối đa 2MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Họ và tên</label>
                  <input
                    type="text"
                    className="form-input"
                    name="username"
                    value={formData.username || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="tel"
                    className="form-input"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={handleCancel}>
                    Hủy
                  </button>
                  <button type="button" className="save-btn" onClick={handleUpdate}>
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#FDFDFD', borderRadius: '10px' }}>
                    <span style={{ fontWeight: '500', color: '#4B3B2B' }}>Họ và tên</span>
                    <span style={{ color: '#4B3B2B' }}>{user.username}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#FDFDFD', borderRadius: '10px' }}>
                    <span style={{ fontWeight: '500', color: '#4B3B2B' }}>Email</span>
                    <span style={{ color: '#4B3B2B' }}>{user.email}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#FDFDFD', borderRadius: '10px' }}>
                    <span style={{ fontWeight: '500', color: '#4B3B2B' }}>Số điện thoại</span>
                    <span style={{ color: '#4B3B2B' }}>{user.phone}</span>
                  </div>
                </div>
              </div>
            )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default Profile;