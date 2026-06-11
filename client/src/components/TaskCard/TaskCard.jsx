import { Link } from 'react-router-dom';
import './TaskCard.css';

const priorityColor = { High: '#e17055', Medium: '#fdcb6e', Low: '#00b894' };
const statusColor = { Pending: '#6c63ff', Completed: '#00b894', Expired: '#e17055' };

const TaskCard = ({ task, onDelete, onComplete }) => (
  <div className="task-card">
    {task.taskImage && <img src={task.taskImage} alt="task" className="task-img" />}
    <div className="task-body">
      <div className="task-header">
        <span className="task-priority" style={{ background: priorityColor[task.priority] + '22', color: priorityColor[task.priority] }}>
          {task.priority}
        </span>
        <span className="task-status" style={{ background: statusColor[task.status] + '22', color: statusColor[task.status] }}>
          {task.status}
        </span>
      </div>
      <h3 className="task-title">{task.title}</h3>
      <p className="task-desc">{task.description?.substring(0, 80)}{task.description?.length > 80 ? '...' : ''}</p>
      <p className="task-due">📅 {new Date(task.dueDate).toLocaleDateString()} {task.dueTime && `⏰ ${task.dueTime}`}</p>
    </div>
    <div className="task-actions">
      <Link to={`/tasks/${task._id}`} className="btn-view">View</Link>
      {task.status === 'Pending' && (
        <button className="btn-complete" onClick={() => onComplete(task._id)}>✓ Done</button>
      )}
      <Link to={`/tasks/${task._id}/edit`} className="btn-edit">Edit</Link>
      <button className="btn-delete" onClick={() => onDelete(task._id)}>🗑</button>
    </div>
  </div>
);
export default TaskCard;
