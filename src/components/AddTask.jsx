import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ActivityWidget from './ActivityWidget';
import './AddTask.css';

const AddTask = () => {
  const { addTodo } = useTodos();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [status, setStatus] = useState('not_started');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    await addTodo({
      title,
      description,
      due_date: dueDate.toISOString(),
      status,
    });
    setSubmitting(false);
    setTitle('');
    setDescription('');
    setDueDate(new Date());
    setStatus('not_started');
  };

  return (
    <div className="addtask-layout">
      <form className="addtask-form" onSubmit={onSubmit}>
        <h2 className="form-title">Add Task</h2>
        <div className="form-row">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter task title" />
        </div>
        <div className="form-row">
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description" />
        </div>
        <div className="form-row two-cols">
          <div className="col">
            <label>Due Date</label>
            <DatePicker selected={dueDate} onChange={setDueDate} showTimeSelect dateFormat="Pp" className="date-input" />
          </div>
          <div className="col">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={submitting}>{submitting ? 'Saving...' : 'Save Task'}</button>
          <button type="button" className="reset-btn" onClick={() => { setTitle(''); setDescription(''); setDueDate(new Date()); setStatus('not_started'); }}>Reset</button>
        </div>
      </form>

      <div className="addtask-side">
        <ActivityWidget />
      </div>
    </div>
  );
};

export default AddTask;