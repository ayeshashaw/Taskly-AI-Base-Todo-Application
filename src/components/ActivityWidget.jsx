import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTodos } from '../context/TodoContext';
import './ActivityWidget.css';

const ActivityWidget = () => {
  const { t } = useTranslation();
  const { todos } = useTodos();
  const [view, setView] = useState('week');

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

  const renderPieChart = () => {
    const total = todayData.total;
    if (total === 0) {
      return (
        <div className="pie-chart-container">
          <div className="pie-chart-empty">
            <div className="pie-chart-empty-circle">
              <span>0</span>
              <small>Tasks</small>
            </div>
          </div>
          <div className="pie-stats">
            <div className="stat-item">
              <div className="stat-color completed"></div>
              <span className="stat-label">{t('activity.completed')}</span>
              <span className="stat-value">0</span>
            </div>
            <div className="stat-item">
              <div className="stat-color in-progress"></div>
              <span className="stat-label">{t('activity.inProgress')}</span>
              <span className="stat-value">0</span>
            </div>
            <div className="stat-item">
              <div className="stat-color not-started"></div>
              <span className="stat-label">{t('activity.notStarted')}</span>
              <span className="stat-value">0</span>
            </div>
          </div>
        </div>
      );
    }

    const completedPercent = (todayData.completed / total) * 100;
    const inProgressPercent = (todayData.inProgress / total) * 100;
    const notStartedPercent = (todayData.notStarted / total) * 100;

    let cumulativePercent = 0;
    const segments = [];

    if (todayData.notStarted > 0) {
      segments.push({
        color: '#f97316',
        percent: notStartedPercent,
        offset: cumulativePercent,
      });
      cumulativePercent += notStartedPercent;
    }

    if (todayData.inProgress > 0) {
      segments.push({
        color: '#8b5cf6',
        percent: inProgressPercent,
        offset: cumulativePercent,
      });
      cumulativePercent += inProgressPercent;
    }

    if (todayData.completed > 0) {
      segments.push({
        color: '#10b981',
        percent: completedPercent,
        offset: cumulativePercent,
      });
    }

    return (
      <div className="pie-chart-container">
        <div className="pie-chart-wrapper">
          <svg viewBox="0 0 200 200" className="pie-chart">
            {segments.map((segment, index) => {
              const radius = 80;
              const circumference = 2 * Math.PI * radius;
              const strokeDasharray = `${(segment.percent / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((segment.offset / 100) * circumference);

              return (
                <circle
                  key={index}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="40"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 100 100)"
                />
              );
            })}
          </svg>
          <div className="pie-chart-center">
            <span className="pie-chart-total">{total}</span>
            <span className="pie-chart-label">Tasks</span>
          </div>
        </div>
        <div className="pie-stats">
          <div className="stat-item">
            <div className="stat-color completed"></div>
            <span className="stat-label">{t('activity.completed')}</span>
            <span className="stat-value">{todayData.completed}</span>
          </div>
          <div className="stat-item">
            <div className="stat-color in-progress"></div>
            <span className="stat-label">{t('activity.inProgress')}</span>
            <span className="stat-value">{todayData.inProgress}</span>
          </div>
          <div className="stat-item">
            <div className="stat-color not-started"></div>
            <span className="stat-label">{t('activity.notStarted')}</span>
            <span className="stat-value">{todayData.notStarted}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="activity-widget-card">
      <div className="card-header">
        <h2 className="card-title">{t('activity.activity')}</h2>
        <div className="toggle-buttons">
          <button className={`toggle-btn ${view === 'week' ? 'active' : ''}`} onClick={() => setView('week')}>
            {t('activity.week')}
          </button>
          <button className={`toggle-btn ${view === 'day' ? 'active' : ''}`} onClick={() => setView('day')}>
            {t('activity.day')}
          </button>
        </div>
      </div>

      {view === 'week' ? (
        <>
          <div className="activity-legend">
            <div className="legend-item">
              <div className="legend-color completed"></div>
              <span>{t('activity.completed')}</span>
            </div>
            <div className="legend-item">
              <div className="legend-color in-progress"></div>
              <span>{t('activity.inProgress')}</span>
            </div>
            <div className="legend-item">
              <div className="legend-color not-started"></div>
              <span>{t('activity.notStarted')}</span>
            </div>
          </div>

          <div className="bar-graph-container">
            <div className="bar-graph-y-axis">
              {[...Array(5)].map((_, i) => {
                const value = Math.ceil((maxCount / 4) * (4 - i));
                return <span key={i} className="y-axis-label">{value}</span>;
              })}
              <span className="y-axis-label">0</span>
            </div>
            <div className="bar-graph">
              {activityData.map((data, index) => {
                const totalHeight = data.total > 0 ? (data.total / maxCount) * 100 : 0;

                return (
                  <div key={index} className="bar-wrapper">
                    <div className="bar-column">
                      {data.total > 0 ? (
                        <>
                          {data.completed > 0 && (
                            <div
                              className="bar-segment completed"
                              style={{ height: `${(data.completed / data.total) * totalHeight}%` }}
                              title={`Completed: ${data.completed}`}
                            ></div>
                          )}
                          {data.inProgress > 0 && (
                            <div
                              className="bar-segment in-progress"
                              style={{ height: `${(data.inProgress / data.total) * totalHeight}%` }}
                              title={`In Progress: ${data.inProgress}`}
                            ></div>
                          )}
                          {data.notStarted > 0 && (
                            <div
                              className="bar-segment not-started"
                              style={{ height: `${(data.notStarted / data.total) * totalHeight}%` }}
                              title={`Not Started: ${data.notStarted}`}
                            ></div>
                          )}
                        </>
                      ) : (
                        <div className="bar-empty"></div>
                      )}
                      {data.isToday && <div className="today-indicator"></div>}
                    </div>
                    <div className={`bar-label ${data.isToday ? 'today' : ''}`}>{data.day}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        renderPieChart()
      )}
    </div>
  );
};

export default ActivityWidget;
