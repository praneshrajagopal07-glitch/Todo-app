import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Loader from '../../components/Loader/Loader';
import TaskModal from '../../components/TaskModal/TaskModal';
import { taskService } from '../../services/taskService';
import './TaskDetails.css';

const priorityColor = { High: '#e17055', Medium: '#fdcb6e', Low: '#00b894' };
const statusColor = { Pending: '#6c63ff', Completed: '#00b894', Expired: '#e17055' };

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    taskService.getTask(id)
      .then(setTask)
      .catch(() => toast.error('Task not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted');
      navigate('/dashboard');
    } catch { toast.error('Delete failed'); }
  };

  const handleComplete = async () => {
    try {
      const updated = await taskService.completeTask(id);
      setTask(updated);
      toast.success('Task completed! 🎉');
    } catch { toast.error('Update failed'); }
  };

  if (loading) return <Loader />;
  if (!task) return <div style={{ padding: '40px', textAlign: 'center' }}>Task not found. <Link to="/dashboard">Go back</Link></div>;

  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <div className="task-details-page">
            <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
            {task.taskImage && <img src={task.taskImage} alt="task" className="task-detail-img" />}
            <div className="task-detail-card">
              <div className="detail-badges">
                <span className="badge" style={{ background: priorityColor[task.priority] + '22', color: priorityColor[task.priority] }}>{task.priority} Priority</span>
                <span className="badge" style={{ background: statusColor[task.status] + '22', color: statusColor[task.status] }}>{task.status}</span>
              </div>
              <h1 className="detail-title">{task.title}</h1>
              {task.description && <p className="detail-desc">{task.description}</p>}
              <div className="detail-meta">
                <div className="meta-item"><span>📅 Due Date</span><strong>{new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></div>
                {task.dueTime && <div className="meta-item"><span>⏰ Due Time</span><strong>{task.dueTime}</strong></div>}
                <div className="meta-item"><span>📌 Created</span><strong>{new Date(task.createdAt).toLocaleDateString()}</strong></div>
              </div>
              <div className="detail-actions">
                {task.status === 'Pending' && (
                  <button className="btn-complete" onClick={handleComplete}>✓ Mark Complete</button>
                )}
                <Link to={`/tasks/${id}/edit`} className="btn-edit">✏️ Edit Task</Link>
                <button className="btn-delete" onClick={() => setShowDelete(true)}>🗑 Delete</button>
              </div>
            </div>
          </div>
        </main>
      </div>
      {showDelete && (
        <TaskModal title="Delete Task" message="Are you sure? This action cannot be undone."
          onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
      )}
    </div>
  );
};
export default TaskDetails;
