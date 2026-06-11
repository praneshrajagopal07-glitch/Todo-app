import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiX, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Loader from '../../components/Loader/Loader';
import { taskService } from '../../services/taskService';
import '../CreateTask/CreateTask.css';
import './EditTask.css';

const parseDueTime = (value) => {
  if (!value) return { hour: '07', minute: '30', period: 'AM' };
  const match = value.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return { hour: '07', minute: '30', period: 'AM' };

  let hour = Number(match[1]);
  const minute = match[2];
  let period = (match[3] || 'AM').toUpperCase();

  if (hour === 0) {
    hour = 12;
    period = 'AM';
  } else if (hour > 12) {
    hour -= 12;
    period = 'PM';
  }

  return { hour: String(hour).padStart(2, '0'), minute, period };
};

const formatDueTime = ({ hour, minute, period }) => `${hour}:${minute} ${period}`;

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [imageRemoved, setImageRemoved] = useState(false);
  const [dueTime, setDueTime] = useState({ hour: '07', minute: '30', period: 'AM' });
  const fileInputRef = useRef(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const taskImageField = register('taskImage');

  useEffect(() => {
    taskService.getTask(id).then(task => {
      reset({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate?.split('T')[0],
      });
      setDueTime(parseDueTime(task.dueTime));
      setPreview(task.taskImage || null);
      setFileName(task.taskImage ? task.taskImage.split('/').pop() : '');
      setImageRemoved(false);
    }).catch(() => toast.error('Failed to load task'))
      .finally(() => setFetching(false));
  }, [id, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    setImageRemoved(false);
  };

  const clearImage = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    setPreview(null);
    setFileName('');
    setImageRemoved(true);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k !== 'taskImage') formData.append(k, v);
      });
      formData.set('dueTime', formatDueTime(dueTime));
      if (imageRemoved && !data.taskImage?.[0]) formData.set('removeTaskImage', 'true');
      if (data.taskImage?.[0]) formData.append('taskImage', data.taskImage[0]);
      await taskService.updateTask(id, formData);
      toast.success('Task updated!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader />;

  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <div className="task-form-page">
            <h1>Edit Task</h1>
            <p className="subtitle">Update the task details below</p>
            <form onSubmit={handleSubmit(onSubmit)} className="task-form">
              <div className="form-group">
                <label>Task Title *</label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  className={errors.title ? 'error' : ''}
                />
                {errors.title && <span className="err-msg">{errors.title.message}</span>}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea {...register('description')} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select {...register('priority')}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select {...register('status')}>
                    <option>Pending</option>
                    <option>Completed</option>
                    <option>Expired</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Due Date</label>
                  <input type="date" {...register('dueDate')} />
                </div>
                <div className="form-group">
                  <label>Due Time</label>
                  <div className="time-picker">
                    <select
                      value={dueTime.hour}
                      onChange={(e) => setDueTime((current) => ({ ...current, hour: e.target.value }))}
                    >
                      {Array.from({ length: 12 }, (_, i) => {
                        const value = String(i + 1).padStart(2, '0');
                        return <option key={value} value={value}>{value}</option>;
                      })}
                    </select>
                    <span className="time-separator">:</span>
                    <select
                      value={dueTime.minute}
                      onChange={(e) => setDueTime((current) => ({ ...current, minute: e.target.value }))}
                    >
                      {Array.from({ length: 60 }, (_, i) => {
                        const value = String(i).padStart(2, '0');
                        return <option key={value} value={value}>{value}</option>;
                      })}
                    </select>
                    <select
                      value={dueTime.period}
                      onChange={(e) => setDueTime((current) => ({ ...current, period: e.target.value }))}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Replace Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input"
                  name={taskImageField.name}
                  onBlur={taskImageField.onBlur}
                  ref={(node) => {
                    taskImageField.ref(node);
                    fileInputRef.current = node;
                  }}
                  onChange={(e) => {
                    taskImageField.onChange(e);
                    handleFileChange(e);
                  }}
                />
                {!preview && (
                  <button
                    type="button"
                    className="file-choose-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FiUpload /> Choose file
                  </button>
                )}
                {preview && (
                  <div className="file-preview-wrap">
                    <button type="button" className="file-remove-btn" onClick={clearImage} aria-label="Remove image">
                      <FiX />
                    </button>
                    <img src={preview} alt="preview" className="file-preview" />
                    <div className="file-name">{fileName}</div>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditTask;
