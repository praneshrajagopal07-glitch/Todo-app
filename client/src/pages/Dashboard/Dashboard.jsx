import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import StatsCard from '../../components/StatsCard/StatsCard';
import TaskCard from '../../components/TaskCard/TaskCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import TaskModal from '../../components/TaskModal/TaskModal';
import Loader from '../../components/Loader/Loader';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, expired: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', priority: '', search: '' });
  const [deleteModal, setDeleteModal] = useState(null);

  const fetchData = async () => {
    try {
      const [t, s] = await Promise.all([taskService.getTasks(filter), taskService.getStats()]);
      setTasks(t); setStats(s);
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [filter]);

  const handleDelete = async () => {
    try {
      await taskService.deleteTask(deleteModal);
      toast.success('Task deleted');
      setDeleteModal(null);
      fetchData();
    } catch { toast.error('Delete failed'); }
  };

  const handleComplete = async (id) => {
    try {
      await taskService.completeTask(id);
      toast.success('Task marked complete! 🎉');
      fetchData();
    } catch { toast.error('Failed to update task'); }
  };

  if (loading) return <Loader />;

  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <div className="dashboard-header">
            <div>
              <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
              <p className="subtitle">Here's your task overview</p>
            </div>
            <Link to="/tasks/create" className="btn-new-task">+ New Task</Link>
          </div>

          <div className="stats-row">
            <StatsCard label="Total Tasks" count={stats.total} icon="📋" color="#6c63ff" />
            <StatsCard label="Pending" count={stats.pending} icon="⏳" color="#fdcb6e" />
            <StatsCard label="Completed" count={stats.completed} icon="✅" color="#00b894" />
            <StatsCard label="Expired" count={stats.expired} icon="⚠️" color="#e17055" />
          </div>

          <div className="filters-row">
            <SearchBar onSearch={(v) => setFilter(f => ({ ...f, search: v }))} />
            <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))} className="filter-select">
              <option value="">All Status</option>
              <option>Pending</option><option>Completed</option><option>Expired</option>
            </select>
            <select value={filter.priority} onChange={e => setFilter(f => ({ ...f, priority: e.target.value }))} className="filter-select">
              <option value="">All Priority</option>
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>

          {tasks.length === 0
            ? <div className="empty-state"><p>🎯 No tasks found. <Link to="/tasks/create">Create one!</Link></p></div>
            : <div className="tasks-grid">
                {tasks.map(t => (
                  <TaskCard key={t._id} task={t} onDelete={setDeleteModal} onComplete={handleComplete} />
                ))}
              </div>
          }
        </main>
      </div>
      <Footer />
      {deleteModal && (
        <TaskModal
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteModal(null)}
        />
      )}
    </div>
  );
};
export default Dashboard;
