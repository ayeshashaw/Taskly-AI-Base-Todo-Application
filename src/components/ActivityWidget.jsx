import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTodos } from '../context/TodoContext';
import './ActivityWidget.css';

// Reusable activity summary (week/day)
const ActivityWidget = () => {
  const { t } = useTranslation();
  const { todos } = useTodos();
  const [view, setView] = useState('week'); // 'week' | 'day'

  const activityData = useMemo(() => {
    const last7Days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayTasks = todos.filter(todo => {
        if (!todo.created_at) return false;
        const todoDate = new Date(todo.created_at);
        todoDate.setHours(0, 0, 0, 0);
        return todoDate.getTime() === date.getTime();
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
        isToday: date.getTime() === today.getTime(),
      });
    }
    return last7Days;
  }, [todos]);

  const todayData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTasks = todos.filter(todo => {
      if (!todo.created_at) return false;
      const todoDate = new Date(todo.created_at);
      todoDate.setHours(0, 0, 0, 0);
      return todoDate.getTime() === today.getTime();
    });

    return {
      completed: todayTasks.filter(t => t.status === 'completed').length,
      inProgress: todayTasks.filter(t => t.status === 'in_progress').length,
      notStarted: todayTasks.filter(t => t.status === 'not_started' || !t.status).length,
      total: todayTasks.length,
    };
  }, [todos]);

  const maxCount = Math.max(...activityData.map(d => d.total), 1);

  return (
    <div className="activity-widget-card">
      <div className="card-header">
        <h2 className="card-title">{t('activity.activity')}</h2>
        <div className="toggle-buttons">
          <button className={`toggle-btn ${view === 'week' ? 'active' : ''}`} onClick={() => setView('week')}>{t('activity.week')}</button>
          <button className={`toggle-btn ${view === 'day' ? 'active' : ''}`} onClick={() => setView('day')}>{t('activity.day')}</button>
        </div>
      </div>

      {view === 'week' ? (
        <>
          <div className="activity-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#10b981' }}></div>
              <span>{t('activity.completed')}</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#8b5cf6' }}></div>
              <span>{t('activity.inProgress')}</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#f97316' }}></div>
              <span>{t('activity.notStarted')}</span>
            </div>
          </div>

          <div className="activity-chart">
            {activityData.map((data, index) => {
              const totalHeight = data.total > 0 ? (data.total / maxCount) * 100 : 0;
              const completedHeight = data.total > 0 ? (data.completed / data.total) * totalHeight : 0;
              const inProgressHeight = data.total > 0 ? (data.inProgress / data.total) * totalHeight : 0;
              const notStartedHeight = data.total > 0 ? (data.notStarted / data.total) * totalHeight : 0;

              return (
                <div key={index} className="chart-bar-wrapper">
                  <div
                    className={`chart-bar-stacked ${data.isToday ? 'today' : ''}`}
                    style={{ height: `${totalHeight}%` }}
                  >
                    {data.notStarted > 0 && (
                      <div
                        className="chart-bar-segment not-started"
                        style={{ flex: data.notStarted }}
                        title={`Not Started: ${data.notStarted}`}
                      ></div>
                    )}
                    {data.inProgress > 0 && (
                      <div
                        className="chart-bar-segment in-progress"
                        style={{ flex: data.inProgress }}
                        title={`In Progress: ${data.inProgress}`}
                      ></div>
                    )}
                    {data.completed > 0 && (
                      <div
                        className="chart-bar-segment completed"
                        style={{ flex: data.completed }}
                        title={`Completed: ${data.completed}`}
                      ></div>
                    )}
                  </div>
                  <div className="chart-bar-label">{data.day}</div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="today-summary">
          <div className="summary-item">
            <span className="summary-label">{t('activity.completed')}</span>
            <span className="summary-value">{todayData.completed}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">{t('activity.inProgress')}</span>
            <span className="summary-value">{todayData.inProgress}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">{t('activity.notStarted')}</span>
            <span className="summary-value">{todayData.notStarted}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">{t('activity.total')}</span>
            <span className="summary-value">{todayData.total}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityWidget;