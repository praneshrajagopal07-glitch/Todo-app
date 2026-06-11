import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => (
  <div className="notfound">
    <h1>404</h1>
    <p>Oops! Page not found.</p>
    <Link to="/dashboard" className="btn-home">Back to Dashboard</Link>
  </div>
);

export default NotFound;
