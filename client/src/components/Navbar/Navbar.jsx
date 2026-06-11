import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = ({ notifCount = 0 }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">✅ TodoApp</Link>
      <div className="navbar-right">
        {notifCount > 0 && <span className="notif-badge">{notifCount}</span>}
        <Link to="/profile" className="navbar-avatar">
          {user?.profileImage
            ? <img src={user.profileImage} alt="avatar" />
            : <span>{user?.name?.[0]?.toUpperCase()}</span>}
        </Link>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};
export default Navbar;
