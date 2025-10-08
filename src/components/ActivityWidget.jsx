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

  const createPieSlice = (startAngle, endAngle, color) => {
    const radius = 90;
    const centerX = 100;
    const centerY = 100;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    return <path key={startAngle} d={pathData} fill={color} />;
  };

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

    const slices = [];
    let currentAngle = -90;

    if (todayData.notStarted > 0) {
      const angle = (todayData.notStarted / total) * 360;
      slices.push(createPieSlice(currentAngle, currentAngle + angle, '#f97316'));
      currentAngle += angle;
    }

    if (todayData.inProgress > 0) {
      const angle = (todayData.inProgress / total) * 360;
      slices.push(createPieSlice(currentAngle, currentAngle + angle, '#8b5cf6'));
      currentAngle += angle;
    }

    if (todayData.completed > 0) {
      const angle = (todayData.completed / total) * 360;
      slices.push(createPieSlice(currentAngle, currentAngle + angle, '#10b981'));
    }

    return (
      <div className="pie-chart-container">
        <div className="pie-chart-wrapper">
          <svg viewBox="0 0 200 200" className="pie-chart">
            {slices}
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
