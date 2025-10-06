import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTodos } from '../context/TodoContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AddTask.css';
import { geminiGenerateTasks, mockGenerateTasks } from '../utils/taskGenerator';

const AddTask = () => {
  const { t } = useTranslation();
  const { addTodo } = useTodos();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [status, setStatus] = useState('not_started');
  const [submitting, setSubmitting] = useState(false);

  // AI generator states
  const [aiTasks, setAiTasks] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // Handle normal form submission
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
    setAiTasks([]);
  };

  // Handle AI task generation
  const handleAIGenerate = async () => {
    if (!title.trim()) {
      setAiError('Please enter a goal or task title first!');
      setTimeout(() => setAiError(''), 3000);
      return;
    }

    setAiLoading(true);
    setAiError('');
    try {
      const tasks = await geminiGenerateTasks(title);
      setAiTasks(tasks);
    } catch (error) {
      console.error(error);
      setAiError('AI service unavailable, showing mock tasks instead.');
      const fallback = mockGenerateTasks(title);
      setAiTasks(fallback);
    } finally {
      setAiLoading(false);
    }
  };

  // When user clicks an AI task → fill it in the input
  const handleSelectAITask = (task) => {
    setTitle(task);
    setDescription(`Generated task for: ${task}`);
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setDueDate(new Date());
    setStatus('not_started');
    setAiTasks([]);
    setAiError('');
  };

  return (
    <div className="addtask-layout">
      <form className="addtask-form" onSubmit={onSubmit}>
        <h2 className="form-title">{t('todos.addNewTask')}</h2>

        <div className="form-row">
          <label>{t('todos.title')}</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('todos.enterTaskTitle')}
          />
        </div>

        <div className="form-row">
          <label>{t('todos.description')}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('todos.enterDescription')}
          />
        </div>

        <div className="form-row two-cols">
          <div className="col">
            <label>{t('todos.dueDate')}</label>
            <DatePicker
              selected={dueDate}
              onChange={setDueDate}
              showTimeSelect
              dateFormat="Pp"
              className="date-input"
            />
          </div>
          <div className="col">
            <label>{t('todos.status')}</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="not_started">{t('todos.notStarted')}</option>
              <option value="in_progress">{t('todos.inProgress')}</option>
              <option value="completed">{t('todos.completed')}</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={submitting || !title.trim()}
          >
            {submitting ? t('todos.saving') : t('todos.saveTask')}
          </button>

          <button
            type="button"
            className="ai-btn"
            onClick={handleAIGenerate}
            disabled={aiLoading || !title.trim()}
          >
            <span className="ai-btn-icon">✨</span>
            <span>{aiLoading ? 'Generating...' : 'AI Suggestions'}</span>
          </button>

          <button
            type="button"
            className="reset-btn"
            onClick={handleReset}
          >
            {t('todos.reset')}
          </button>
        </div>

        {aiError && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {aiError}
          </div>
        )}
      </form>

      {aiTasks.length > 0 && (
        <div className="ai-tasks-preview">
          <h3 className="ai-tasks-title">
            <span className="sparkle">✨</span>
            Suggested Tasks for "{title}"
          </h3>
          <ul className="ai-tasks-list">
            {aiTasks.map((task, i) => (
              <li
                key={i}
                className="ai-task-item"
                onClick={() => handleSelectAITask(task)}
              >
                <span className="task-number">{i + 1}</span>
                <span className="task-text">{task}</span>
              </li>
            ))}
          </ul>
          <p className="ai-tasks-tip">
            <span className="tip-icon">💡</span>
            Click a task to fill it into the form!
          </p>
        </div>
      )}
    </div>
  );
};

export default AddTask;