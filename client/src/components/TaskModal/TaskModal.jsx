import './TaskModal.css';
const TaskModal = ({ title, message, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>{title}</h3>
      <p>{message}</p>
      <div className="modal-actions">
        <button className="btn-cancel" onClick={onCancel}>Cancel</button>
        <button className="btn-confirm" onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  </div>
);
export default TaskModal;
