import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiX, FiUpload } from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import { taskService } from '../../services/taskService';
import './CreateTask.css';

const CreateTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [dueTime, setDueTime] = useState({ hour: '07', minute: '30', period: 'AM' });
  const fileInputRef = useRef(null);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const taskImageField = register('taskImage');

  const formatDueTime = ({ hour, minute, period }) => `${hour}:${minute} ${period}`;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    setFileName('');
    setPreview(null);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k !== 'taskImage') formData.append(k, v);
      });
      formData.set('dueTime', formatDueTime(dueTime));
      if (data.taskImage?.[0]) formData.append('taskImage', data.taskImage[0]);
      await taskService.createTask(formData);
      toast.success('Task created! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <div className="task-form-page">
            <h1>Create New Task</h1>
            <p className="subtitle">Fill in the details to add a new task</p>
            <form onSubmit={handleSubmit(onSubmit)} className="task-form">
              <div className="form-group">
                <label>Task Title *</label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  placeholder="e.g. Complete project report"
                  className={errors.title ? 'error' : ''}
                />
                {errors.title && <span className="err-msg">{errors.title.message}</span>}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea {...register('description')} placeholder="Add task details..." />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority *</label>
                  <select {...register('priority', { required: true })}>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Due Date *</label>
                  <input
                    type="date"
                    {...register('dueDate', { required: 'Due date is required' })}
                    className={errors.dueDate ? 'error' : ''}
                  />
                  {errors.dueDate && <span className="err-msg">{errors.dueDate.message}</span>}
                </div>
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

              <div className="form-group">
                <label>Task Image (optional)</label>
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
                <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateTask;
