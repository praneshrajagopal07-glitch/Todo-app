import './StatsCard.css';
const StatsCard = ({ label, count, icon, color }) => (
  <div className="stats-card" style={{ borderLeft: `4px solid ${color}` }}>
    <span className="stats-icon">{icon}</span>
    <div>
      <p className="stats-count">{count}</p>
      <p className="stats-label">{label}</p>
    </div>
  </div>
);
export default StatsCard;
