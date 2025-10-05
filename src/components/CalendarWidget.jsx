import React, { useState, useMemo } from 'react';
import { useTodos } from '../context/TodoContext';
import './CalendarWidget.css';

// Compact, reusable calendar (day/week) extracted from dashboard
const CalendarWidget = ({ defaultView = 'week', compact = false, showToolbar = true }) => {
  const { todos } = useTodos();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState(defaultView); // 'day' | 'week'

  const timeSlots = useMemo(() => Array.from({ length: 17 }, (_, i) => i + 6), []);

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

  const scheduleData = useMemo(() => {
    if (view === 'day') {
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
    }
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
        date,
        dayName: date.toLocaleDateString('en-US', { weekday: compact ? 'short' : 'long' }),
        dayNumber: date.getDate(),
        isToday: date.toDateString() === new Date().toDateString(),
        tasks: dayTasks,
      });
    }
    return days;
  }, [todos, selectedDate, view, compact]);

  const goToPrevious = () => {
    const delta = view === 'day' ? 1 : 7;
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - delta);
    setSelectedDate(newDate);
  };

  const goToNext = () => {
    const delta = view === 'day' ? 1 : 7;
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + delta);
    setSelectedDate(newDate);
  };

  const goToToday = () => setSelectedDate(new Date());

  return (
    <div className={`calendar-widget-card ${compact ? 'compact' : ''}`}>
      {showToolbar && (
      <div className="calendar-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn" onClick={goToPrevious} aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className="toolbar-btn" onClick={goToToday} aria-label="Today">Today</button>
          <button className="toolbar-btn" onClick={goToNext} aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
        <div className="toolbar-right">
          <button 
            className={`view-toggle ${view === 'day' ? 'active' : ''}`} 
            onClick={() => setView('day')}
          >Day</button>
          <button 
            className={`view-toggle ${view === 'week' ? 'active' : ''}`} 
            onClick={() => setView('week')}
          >Week</button>
        </div>
      </div>
      )}

      <div className="ms-calendar-container">
        {!compact && (
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
        )}

        <div className="days-container">
          <div className="day-headers">
            {scheduleData.map((day, index) => (
              <div key={index} className={`day-header-cell ${day.isToday ? 'today' : ''}`}>
                <div className="day-name">{day.dayName}</div>
                <div className="day-number">{day.dayNumber}</div>
              </div>
            ))}
          </div>

          <div className="time-grid">
            {scheduleData.map((day, dayIndex) => (
              <div key={dayIndex} className="day-column">
                {!compact && timeSlots.map((hour) => (
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
                      style={{ top: `${topPosition}%`, height: `${height}%` }}
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
  );
};

export default CalendarWidget;