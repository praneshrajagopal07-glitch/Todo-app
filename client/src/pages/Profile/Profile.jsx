import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.profileImage || null);

  const { register: regProfile, handleSubmit: handleProfile, reset: resetProfile } = useForm();
  const { register: regPwd, handleSubmit: handlePwd, reset: resetPwd } = useForm();

  useEffect(() => { resetProfile({ name: user?.name, email: user?.email }); }, [user]);
  useEffect(() => { setAvatarPreview(user?.profileImage || null); }, [user?.profileImage]);

  const onUpdateProfile = async (data) => {
    setLoading(true);
    try {
      const res = await api.put('/profile', data);
      updateUser({ ...user, ...res.data });
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.message || 'Update failed'); }
    finally { setLoading(false); }
  };

  const onChangePassword = async (data) => {
    if (data.newPassword !== data.confirmNew) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await api.put('/profile/password', { currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed!');
      resetPwd();
    } catch (err) { toast.error(err.message || 'Failed to change password'); }
    finally { setLoading(false); }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);
    const formData = new FormData();
    formData.append('profileImage', file);
    try {
      const res = await api.put('/profile/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const nextImage = res.data.profileImage || localPreview;
      setAvatarPreview(nextImage);
      updateUser({ ...user, profileImage: nextImage });
      toast.success('Profile photo updated!');
    } catch { toast.error('Image upload failed'); }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <div className="profile-page">
            <h1>Profile Settings</h1>
            <div className="profile-layout">
              {/* Avatar */}
              <div className="avatar-section">
                <label className="avatar-wrap" htmlFor="avatarInput">
                  {avatarPreview
                    ? <img src={avatarPreview} alt="avatar" />
                    : <span className="avatar-initials">{user?.name?.[0]?.toUpperCase()}</span>}
                  <div className="avatar-overlay">📷 Change</div>
                </label>
                <input id="avatarInput" type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                <h2>{user?.name}</h2>
                <p>{user?.email}</p>

              </div>

              {/* Tabs */}
              <div className="profile-tabs-area">
                <div className="tabs">
                  <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>Edit Profile</button>
                  <button className={tab === 'password' ? 'active' : ''} onClick={() => setTab('password')}>Change Password</button>
                </div>

                {tab === 'profile' && (
                  <form onSubmit={handleProfile(onUpdateProfile)} className="profile-form">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input {...regProfile('name', { required: true })} />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" {...regProfile('email', { required: true })} />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                  </form>
                )}

                {tab === 'password' && (
                  <form onSubmit={handlePwd(onChangePassword)} className="profile-form">
                    <div className="form-group">
                      <label>Current Password</label>
                      <input type="password" {...regPwd('currentPassword', { required: true })} />
                    </div>
                    <div className="form-group">
                      <label>New Password</label>
                      <input type="password" {...regPwd('newPassword', { required: true, minLength: { value: 6, message: 'Min 6 chars' } })} />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input type="password" {...regPwd('confirmNew', { required: true })} />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Changing...' : 'Change Password'}</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
export default Profile;
