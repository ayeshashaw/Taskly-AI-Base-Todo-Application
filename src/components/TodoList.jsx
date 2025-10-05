import React, { useState, useEffect, useMemo } from 'react';
import { useTodos } from '../context/TodoContext';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TodoList.css';

const TodoList = () => {
  const { t } = useTranslation();
  const { todos, loading, fetchTodos, addTodo, updateTodo, deleteTodo } = useTodos();
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoDate, setNewTodoDate] = useState(new Date());
  const [newTodoStatus, setNewTodoStatus] = useState('not_started');
  const [editingTodo, setEditingTodo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [activeView, setActiveView] = useState('week');
  const [scheduleView, setScheduleView] = useState('week');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const newTodo = {
      title: newTodoTitle,
      description: newTodoDescription,
      completed: false,
      due_date: newTodoDate.toISOString(),
      status: newTodoStatus
    };

    await addTodo(newTodo);
    setNewTodoTitle('');
    setNewTodoDescription('');
    setNewTodoDate(new Date());
    setNewTodoStatus('not_started');
    setIsAddingTodo(false);
  };

  const handleToggleComplete = async (todo) => {
    await updateTodo(todo.id, { is_complete: !todo.is_complete });
  };

  const handleStartEdit = (todo) => {
    setEditingTodo(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  const handleSaveEdit = async (id) => {
    await updateTodo(id, { 
      title: editTitle, 
      description: editDescription 
    });
    setEditingTodo(null);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('todos.deleteConfirm'))) {
      await deleteTodo(id);
    }
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      let matchesDate = true;
      if (dateFilter) {
        const todoDate = todo.due_date ? new Date(todo.due_date) : null;
        if (todoDate) {
          matchesDate = todoDate.toDateString() === dateFilter.toDateString();
        } else {
          matchesDate = false;
        }
      }

      let matchesStatus = true;
      if (statusFilter !== 'all') {
        matchesStatus = todo.status === statusFilter;
      }
      
      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [todos, searchTerm, dateFilter, statusFilter]);

  const getActivityData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayTasks = todos.filter(todo => {
        const todoDate = new Date(todo.created_at);
        return todoDate.toDateString() === date.toDateString();
      });
      
      const completed = dayTasks.filter(t => t.status === 'completed').length;
      const inProgress = dayTasks.filter(t => t.status === 'in_progress').length;
      const notStarted = dayTasks.filter(t => t.status === 'not_started' || !t.status).length;
      
      last7Days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed,
        inProgress,
        notStarted,
        total: dayTasks.length,
        active: i === 0
      });
    }
    return last7Days;
  };

  const getTodayActivityData = () => {
    const today = new Date();
    const todayTasks = todos.filter(todo => {
      const todoDate = new Date(todo.created_at);
      return todoDate.toDateString() === today.toDateString();
    });
    
    return {
      completed: todayTasks.filter(t => t.status === 'completed').length,
      inProgress: todayTasks.filter(t => t.status === 'in_progress').length,
      notStarted: todayTasks.filter(t => t.status === 'not_started' || !t.status).length,
      total: todayTasks.length
    };
  };

  const getScheduleData = () => {
    if (scheduleView === 'day') {
      const dayTasks = todos.filter(todo => {
        if (!todo.due_date) return false;
        const todoDate = new Date(todo.due_date);
        return todoDate.toDateString() === selectedDate.toDateString();
      });
      
      return [{
        date: selectedDate,
        dayName: selectedDate.toLocaleDateString('en-US', { weekday: 'long' }),
        dayNumber: selectedDate.getDate(),
        isToday: selectedDate.toDateString() === new Date().toDateString(),
        tasks: dayTasks
      }];
    } else {
      const days = [];
      const startOfWeek = new Date(selectedDate);
      const dayOfWeek = selectedDate.getDay();
      startOfWeek.setDate(selectedDate.getDate() - dayOfWeek);
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dayTasks = todos.filter(todo => {
          if (!todo.due_date) return false;
          const todoDate = new Date(todo.due_date);
          return todoDate.toDateString() === date.toDateString();
        });
        
        days.push({
          date: date,
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
          dayNumber: date.getDate(),
          isToday: date.toDateString() === new Date().toDateString(),
          tasks: dayTasks
        });
      }
      
      return days;
    }
  };

  const getTaskTimePosition = (task, index, totalTasks) => {
    const taskDate = new Date(task.due_date);
    const hours = taskDate.getHours();
    const minutes = taskDate.getMinutes();
    
    if (hours !== 0 || minutes !== 0) {
      return { hour: hours, minute: minutes };
    }
    
    const startHour = 9;
    const endHour = 17;
    const hourRange = endHour - startHour;
    const position = startHour + (index / Math.max(totalTasks, 1)) * hourRange;
    
    return { hour: Math.floor(position), minute: 0 };
  };

  const activityData = getActivityData();
  const todayData = getTodayActivityData();
  const scheduleData = getScheduleData();
  const completedCount = todos.filter(todo => todo.is_complete).length;
  const totalCount = todos.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const maxCount = Math.max(...activityData.map(d => d.total), 1);
  const timeSlots = Array.from({ length: 17 }, (_, i) => i + 6);

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="todolist-modern-container">
      <div className="todolist-grid">
        <div className="left-column">
          {/* Activity Chart */}
          <div className="modern-card activity-card">
            <div className="card-header">
              <h2 className="card-title">Activity</h2>
              <div className="toggle-buttons">
                <button 
                  className={`toggle-btn ${activeView === 'week' ? 'active' : ''}`}
                  onClick={() => setActiveView('week')}
                >
                  Week
                </button>
                <button 
                  className={`toggle-btn ${activeView === 'day' ? 'active' : ''}`}
                  onClick={() => setActiveView('day')}
                >
                  Day
                </button>
              </div>
            </div>
            
            {activeView === 'week' ? (
              <>
                <div className="activity-legend">
                  <div className="legend-item">
                    <div className="legend-color" style={{ background: '#10b981' }}></div>
                    <span>Completed</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ background: '#8b5cf6' }}></div>
                    <span>In Progress</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ background: '#f97316' }}></div>
                    <span>Not Started</span>
                  </div>
                </div>
                
                <div className="activity-chart">
                  {activityData.map((data, index) => (
                    <div key={index} className="chart-bar-wrapper">
                      <div className="chart-bar-stacked">
                        {data.total > 0 ? (
                          <>
                            {data.completed > 0 && (
                              <div 
                                className="bar-segment completed"
                                style={{ height: `${(data.completed / maxCount) * 100}%` }}
                                title={`Completed: ${data.completed}`}
                              />
                            )}
                            {data.inProgress > 0 && (
                              <div 
                                className="bar-segment in-progress"
                                style={{ height: `${(data.inProgress / maxCount) * 100}%` }}
                                title={`In Progress: ${data.inProgress}`}
                              />
                            )}
                            {data.notStarted > 0 && (
                              <div 
                                className="bar-segment not-started"
                                style={{ height: `${(data.notStarted / maxCount) * 100}%` }}
                                title={`Not Started: ${data.notStarted}`}
                              />
                            )}
                            <span className="bar-total">{data.total}</span>
                          </>
                        ) : (
                          <div className="bar-segment empty" style={{ height: '30px' }} />
                        )}
                      </div>
                      <span className={`bar-day ${data.active ? 'active' : ''}`}>
                        {data.day}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="pie-chart-container">
                {todayData.total > 0 ? (
                  <>
                    <svg className="pie-chart" viewBox="0 0 200 200">
                      {(() => {
                        const total = todayData.total;
                        const completedPercent = (todayData.completed / total) * 100;
                        const inProgressPercent = (todayData.inProgress / total) * 100;
                        const notStartedPercent = (todayData.notStarted / total) * 100;
                        
                        let currentAngle = 0;
                        const segments = [];
                        
                        const createPieSlice = (percent, color, label, count) => {
                          if (percent === 0) return null;
                          
                          const angle = (percent / 100) * 360;
                          const startAngle = currentAngle;
                          const endAngle = currentAngle + angle;
                          
                          const startRad = (startAngle - 90) * (Math.PI / 180);
                          const endRad = (endAngle - 90) * (Math.PI / 180);
                          
                          const x1 = 100 + 80 * Math.cos(startRad);
                          const y1 = 100 + 80 * Math.sin(startRad);
                          const x2 = 100 + 80 * Math.cos(endRad);
                          const y2 = 100 + 80 * Math.sin(endRad);
                          
                          const largeArc = angle > 180 ? 1 : 0;
                          
                          const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
                          
                          currentAngle += angle;
                          
                          return (
                            <g key={label}>
                              <path
                                d={path}
                                fill={color}
                                stroke="white"
                                strokeWidth="2"
                                className="pie-slice"
                              />
                              <title>{`${label}: ${count} (${percent.toFixed(1)}%)`}</title>
                            </g>
                          );
                        };
                        
                        segments.push(createPieSlice(completedPercent, '#10b981', 'Completed', todayData.completed));
                        segments.push(createPieSlice(inProgressPercent, '#8b5cf6', 'In Progress', todayData.inProgress));
                        segments.push(createPieSlice(notStartedPercent, '#f97316', 'Not Started', todayData.notStarted));
                        
                        return segments;
                      })()}
                      <circle cx="100" cy="100" r="45" fill="white" />
                      <text x="100" y="95" textAnchor="middle" fontSize="24" fontWeight="700" fill="#1f2937">
                        {todayData.total}
                      </text>
                      <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#6b7280">
                        Tasks
                      </text>
                    </svg>
                    
                    <div className="pie-chart-legend">
                      <div className="pie-legend-item">
                        <div className="pie-legend-color" style={{ background: '#10b981' }}></div>
                        <div className="pie-legend-info">
                          <span className="pie-legend-label">Completed</span>
                          <span className="pie-legend-value">{todayData.completed}</span>
                        </div>
                      </div>
                      <div className="pie-legend-item">
                        <div className="pie-legend-color" style={{ background: '#8b5cf6' }}></div>
                        <div className="pie-legend-info">
                          <span className="pie-legend-label">In Progress</span>
                          <span className="pie-legend-value">{todayData.inProgress}</span>
                        </div>
                      </div>
                      <div className="pie-legend-item">
                        <div className="pie-legend-color" style={{ background: '#f97316' }}></div>
                        <div className="pie-legend-info">
                          <span className="pie-legend-label">Not Started</span>
                          <span className="pie-legend-value">{todayData.notStarted}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="empty-state-modern">
                    <p>No tasks created today</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Microsoft Calendar Schedule */}
          <div className="modern-card schedule-card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Schedule</h2>
                <div className="schedule-navigation">
                  <button 
                    className="nav-btn"
                    onClick={scheduleView === 'day' ? goToPreviousDay : goToPreviousWeek}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                  </button>
                  <button className="today-btn" onClick={goToToday}>
                    Today
                  </button>
                  <button 
                    className="nav-btn"
                    onClick={scheduleView === 'day' ? goToNextDay : goToNextWeek}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                  <span className="current-date-label">
                    {selectedDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
              <div className="toggle-buttons">
                <button 
                  className={`toggle-btn ${scheduleView === 'day' ? 'active' : ''}`}
                  onClick={() => setScheduleView('day')}
                >
                  Day
                </button>
                <button 
                  className={`toggle-btn ${scheduleView === 'week' ? 'active' : ''}`}
                  onClick={() => setScheduleView('week')}
                >
                  Week
                </button>
              </div>
            </div>
            
            <div className="ms-calendar-container">
              <div className="time-column">
                <div className="time-header"></div>
                {timeSlots.map((hour) => (
                  <div key={hour} className="time-slot-label">
                    {hour === 0 ? '12 AM' : 
                     hour < 12 ? `${hour} AM` : 
                     hour === 12 ? '12 PM' : 
                     `${hour - 12} PM`}
                  </div>
                ))}
              </div>

              <div className="days-container">
                <div className="day-headers">
                  {scheduleData.map((day, index) => (
                    <div 
                      key={index} 
                      className={`day-header-cell ${day.isToday ? 'today' : ''}`}
                    >
                      <div className="day-name">{day.dayName}</div>
                      <div className="day-number">{day.dayNumber}</div>
                    </div>
                  ))}
                </div>

                <div className="time-grid">
                  {scheduleData.map((day, dayIndex) => (
                    <div key={dayIndex} className="day-column">
                      {timeSlots.map((hour) => (
                        <div key={hour} className="hour-cell"></div>
                      ))}
                      
                      {day.tasks.map((task, taskIndex) => {
                        const { hour, minute } = getTaskTimePosition(task, taskIndex, day.tasks.length);
                        const topPosition = ((hour - 6) * 60 + minute) / (17 * 60) * 100;
                        const height = (1 / 17) * 100;
                        
                        return (
                          <div
                            key={taskIndex}
                            className={`schedule-event status-${task.status || 'not_started'}`}
                            style={{
                              top: `${topPosition}%`,
                              height: `${height}%`
                            }}
                            title={`${task.title}\n${task.description || ''}`}
                          >
                            <div className="event-time">
                              {hour === 0 ? '12:00 AM' : 
                               hour < 12 ? `${hour}:${minute.toString().padStart(2, '0')} AM` : 
                               hour === 12 ? `12:${minute.toString().padStart(2, '0')} PM` : 
                               `${hour - 12}:${minute.toString().padStart(2, '0')} PM`}
                            </div>
                            <div className="event-title">{task.title}</div>
                            {task.description && (
                              <div className="event-description">{task.description}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Task Board */}
        <div className="right-column">
          <div className="modern-card task-board-card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Task board</h2>
                <p className="task-summary">
                  {t('dashboard.tasksCompleted', { completed: completedCount, total: totalCount })}
                </p>
              </div>
              {/* <button 
                className="add-task-btn-modern"
                onClick={() => setIsAddingTodo(!isAddingTodo)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                {isAddingTodo ? t('todos.cancel') : 'All task'}
              </button> */}
            </div>

            {/* <div className="search-bar-modern">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder={t('todos.searchTasks')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="date-filter-container">
              <div className="date-filter-label">{t('todos.filterByDate')}:</div>
              <div className="calendar-filter-container">
                <button 
                  className={`date-filter-btn ${dateFilter === null ? 'active' : ''}`}
                  onClick={() => setDateFilter(null)}
                >
                  {t('todos.all')}
                </button>
                <DatePicker
                  selected={dateFilter}
                  onChange={(date) => setDateFilter(date)}
                  className="calendar-filter"
                  placeholderText={t('todos.selectDate')}
                  dateFormat="dd/MM/yyyy"
                  isClearable
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
              </div>
            </div> */}

            {/* <div className="status-filter-container">
              <div className="status-filter-label">{t('todos.status')}:</div>
              <select
                className="status-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">{t('todos.all')}</option>
                <option value="not_started">{t('todos.notStarted')}</option>
                <option value="in_progress">{t('todos.inProgress')}</option>
                <option value="completed">{t('todos.completed')}</option>
              </select>
            </div> */}

            {totalCount > 0 && (
              <div className="progress-section-modern">
                <div className="progress-bar-modern">
                  <div 
                    className="progress-fill-modern" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <span className="progress-text-modern">{Math.round(progressPercentage)}%</span>
              </div>
            )}

            {isAddingTodo && (
              <div className="task-form-modern">
                <div onSubmit={handleAddTodo}>
                  <input
                    type="text"
                    placeholder={t('todos.taskTitle')}
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    className="input-modern"
                    autoFocus
                    required
                  />
                  <textarea
                    placeholder={t('todos.descriptionOptional')}
                    value={newTodoDescription}
                    onChange={(e) => setNewTodoDescription(e.target.value)}
                    className="textarea-modern"
                    rows="3"
                  />
                  <div className="form-row-modern">
                    <DatePicker
                      selected={newTodoDate}
                      onChange={(date) => setNewTodoDate(date)}
                      className="date-picker-modern"
                      dateFormat="dd/MM/yyyy"
                    />
                    <select 
                      value={newTodoStatus}
                      onChange={(e) => setNewTodoStatus(e.target.value)}
                      className="select-modern"
                    >
                      <option value="not_started">{t('todos.notStarted')}</option>
                      <option value="in_progress">{t('todos.inProgress')}</option>
                      <option value="completed">{t('todos.completed')}</option>
                    </select>
                  </div>
                  <div className="form-actions-modern">
                    <button type="button" className="btn-save-modern" onClick={handleAddTodo}>
                      {t('todos.addTask')}
                    </button>
                    <button 
                      type="button" 
                      className="btn-cancel-modern"
                      onClick={() => {
                        setIsAddingTodo(false);
                        setNewTodoTitle('');
                        setNewTodoDescription('');
                      }}
                    >
                      {t('todos.cancel')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="loading-state-modern">
                <div className="spinner-modern"></div>
                <p>Loading tasks...</p>
              </div>
            )}

            {!loading && todos.length === 0 && (
              <div className="empty-state-modern">
                <div className="empty-icon-modern">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                  </svg>
                </div>
                <h3>No tasks yet</h3>
                <p>Create your first task to get started!</p>
              </div>
            )}

            {!loading && todos.length > 0 && (
              <div className="task-list-modern">
                {filteredTodos.length === 0 ? (
                  <div className="empty-state-modern">
                    <p>{t('todos.noMatchingTasks')}</p>
                  </div>
                ) : (
                  filteredTodos.map((todo) => (
                    <div 
                      key={todo.id} 
                      className={`task-card-modern ${todo.is_complete ? 'completed' : ''}`}
                    >
                      {editingTodo === todo.id ? (
                        <div className="edit-form-modern">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="input-modern"
                          />
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="textarea-modern"
                            rows="2"
                          />
                          <div className="form-actions-modern">
                            <button 
                              className="btn-save-modern"
                              onClick={() => handleSaveEdit(todo.id)}
                            >
                              {t('todos.save')}
                            </button>
                            <button 
                              className="btn-cancel-modern"
                              onClick={handleCancelEdit}
                            >
                              {t('todos.cancel')}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="task-header-modern">
                            <div className="task-title-section">
                              <h3 className="task-title-modern">{todo.title}</h3>
                              <span 
                                className={`status-badge-modern status-${todo.status || 'not_started'}`}
                              >
                                {todo.status === 'not_started' ? t('todos.notStarted') :
                                 todo.status === 'in_progress' ? t('todos.inProgress') :
                                 t('todos.completed')}
                              </span>
                            </div>
                          </div>
                          {todo.description && (
                            <p className="task-description-modern">{todo.description}</p>
                          )}
                          <div className="task-footer-modern">
                            <div className="task-time-modern">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                              </svg>
                              <span>
                                Log {new Date(todo.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="task-actions-modern">
                              <button 
                                className="action-btn-modern"
                                onClick={() => handleToggleComplete(todo)}
                                title={todo.is_complete ? 'Mark incomplete' : 'Mark complete'}
                              >
                                {todo.is_complete ? (
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                    <polyline points="22 4 12 14.01 9 11.01"/>
                                  </svg>
                                ) : (
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/>
                                  </svg>
                                )}
                              </button>
                              <select
                                value={todo.status || 'not_started'}
                                onChange={(e) => updateTodo(todo.id, { status: e.target.value })}
                                className="status-select-modern"
                              >
                                <option value="not_started">{t('todos.notStarted')}</option>
                                <option value="in_progress">{t('todos.inProgress')}</option>
                                <option value="completed">{t('todos.completed')}</option>
                              </select>
                              <button 
                                className="action-btn-modern edit-btn-modern"
                                onClick={() => handleStartEdit(todo)}
                                title="Edit"
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                              </button>
                              <button 
                                className="action-btn-modern delete-btn-modern"
                                onClick={() => handleDelete(todo.id)}
                                title="Delete"
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6"/>
                                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                                  <line x1="10" y1="11" x2="10" y2="17"/>
                                  <line x1="14" y1="11" x2="14" y2="17"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;