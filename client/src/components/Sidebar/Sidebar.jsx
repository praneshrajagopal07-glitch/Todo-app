import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const links = [
  { to: '/dashboard', label: '📊 Dashboard' },
  { to: '/tasks/create', label: '➕ New Task' },
  { to: '/profile', label: '👤 Profile' },
];

const Sidebar = () => (
  <aside className="sidebar">
    <nav>
      {links.map(l => (
        <NavLink key={l.to} to={l.to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          {l.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);
export default Sidebar;
