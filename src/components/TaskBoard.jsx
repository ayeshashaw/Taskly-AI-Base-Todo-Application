import React, { useMemo, useState } from 'react';
import { useTodos } from '../context/TodoContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TaskBoard.css';

const TaskBoard = ({ showControls = true, allowEdit = true }) => {
  const { todos, updateTodo, deleteTodo } = useTodos();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const filtered = useMemo(() => {
    return todos.filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (todo.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      let matchesDate = true;
      if (dateFilter) {
        const d = todo.due_date ? new Date(todo.due_date) : null;
        matchesDate = !!d && d.toDateString() === dateFilter.toDateString();
      }
      const matchesStatus = statusFilter === 'all' ? true : (todo.status === statusFilter);
      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [todos, searchTerm, dateFilter, statusFilter]);

  const progress = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.is_complete).length;
    return total ? Math.round((completed / total) * 100) : 0;
  }, [todos]);

  const toggleComplete = async (todo) => {
    await updateTodo(todo.id, { is_complete: !todo.is_complete });
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title || '');
    setEditDescription(todo.description || '');
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await updateTodo(editingId, { title: editTitle, description: editDescription });
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  return (
    <div className="taskboard-card">
      <div className="taskboard-header">
        <h2 className="taskboard-title">Tasks</h2>
        {showControls && (
          <div className="taskboard-progress">
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div>
            <span className="progress-text">{progress}%</span>
          </div>
        )}
      </div>

      {showControls && (
        <div className="taskboard-controls">
          <div className="search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search tasks" />
          </div>
          <div className="filters">
            <DatePicker
              selected={dateFilter}
              onChange={(date) => setDateFilter(date)}
              className="date-input"
              placeholderText="Filter by date"
              isClearable
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              dateFormat="dd/MM/yyyy"
            />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="status-select">
              <option value="all">All</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      )}

      <ul className="task-list">
        {filtered.map(todo => (
          <li key={todo.id} className={`task-item ${todo.is_complete ? 'done' : ''}`}>
            <div className="task-main">
              {editingId === todo.id ? (
                <div className="edit-fields">
                  <input className="edit-input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" />
                  <textarea className="edit-input" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Description" />
                  <div className="edit-actions">
                    <button className="save-btn" onClick={saveEdit}>Save</button>
                    <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="task-title-row">
                    <input type="checkbox" checked={!!todo.is_complete} onChange={() => toggleComplete(todo)} />
                    <span className="task-title">{todo.title}</span>
                  </div>
                  {todo.description && <div className="task-desc">{todo.description}</div>}
                </>
              )}
            </div>
            <div className="task-meta">
              <span className={`status-badge status-${todo.status || 'not_started'}`}>{(todo.status || 'not_started').replace('_',' ')}</span>
              {todo.due_date && (
                <span className="due-date">{new Date(todo.due_date).toLocaleDateString()}</span>
              )}
              {allowEdit && editingId !== todo.id && (
                <button className="edit-btn" onClick={() => startEdit(todo)} title="Edit">Edit</button>
              )}
              <button className="delete-btn" onClick={() => deleteTodo(todo.id)} title="Delete">✕</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskBoard;