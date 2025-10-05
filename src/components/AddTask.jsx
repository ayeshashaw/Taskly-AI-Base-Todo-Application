import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTodos } from '../context/TodoContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ActivityWidget from './ActivityWidget';
import './AddTask.css';

const AddTask = () => {
  const { t } = useTranslation();
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
        <h2 className="form-title">{t('todos.addNewTask')}</h2>
        <div className="form-row">
          <label>{t('todos.title')}</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('todos.enterTaskTitle')} />
        </div>
        <div className="form-row">
          <label>{t('todos.description')}</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('todos.enterDescription')} />
        </div>
        <div className="form-row two-cols">
          <div className="col">
            <label>{t('todos.dueDate')}</label>
            <DatePicker selected={dueDate} onChange={setDueDate} showTimeSelect dateFormat="Pp" className="date-input" />
          </div>
          <div className="col">
            <label>{t('todos.status')}</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="not_started">{t('todos.notStarted')}</option>
              <option value="in_progress">{t('todos.inProgress')}</option>
              <option value="completed">{t('todos.completed')}</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={submitting}>{submitting ? t('todos.saving') : t('todos.saveTask')}</button>
          <button type="button" className="reset-btn" onClick={() => { setTitle(''); setDescription(''); setDueDate(new Date()); setStatus('not_started'); }}>{t('todos.reset')}</button>
        </div>
      </form>

      <div className="addtask-side">
        <ActivityWidget />
      </div>
    </div>
  );
};

export default AddTask;