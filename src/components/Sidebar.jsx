import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ user, onLogout, activeSection, onSectionChange }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'add-task', label: 'Add Task', icon: 'plus' },
    { id: 'tasks', label: 'Tasks', icon: 'tasks' },
    { id: 'activity', label: 'My Activity', icon: 'activity' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  ];

  const renderIcon = (iconName) => {
    const icons = {
      dashboard: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="sidebar-menu-icon">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
      plus: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="sidebar-menu-icon">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      ),
      tasks: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="sidebar-menu-icon">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      ),
      activity: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="sidebar-menu-icon">
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="20" x2="18" y2="4" />
          <line x1="6" y1="20" x2="6" y2="16" />
        </svg>
      ),
      calendar: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="sidebar-menu-icon">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      menu: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      ),
      close: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      ),
      logout: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      ),
      check: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )
    };
    return icons[iconName] || icons.dashboard;
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            {renderIcon('check')}
          </div>
          <span className="sidebar-logo-text">TaskFlow</span>
        </div>
        <button 
          className="sidebar-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? renderIcon('menu') : renderIcon('close')}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.id} className="sidebar-menu-item">
              <button
                className={`sidebar-menu-btn ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => onSectionChange(item.id)}
                title={collapsed ? item.label : ''}
              >
                {renderIcon(item.icon)}
                <span className="sidebar-menu-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">
              {user?.email?.split('@')[0] || 'User'}
            </span>
            <span className="sidebar-user-role">User</span>
          </div>
          <button 
            className="sidebar-logout-btn"
            onClick={onLogout}
            title="Logout"
          >
            {renderIcon('logout')}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;