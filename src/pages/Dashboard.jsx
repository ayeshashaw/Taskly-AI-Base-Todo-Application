import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import supabase from '../database/superbaseClient';
import TodoList from '../components/TodoList';
import Sidebar from '../components/Sidebar';
import LanguageSwitcher from '../components/LanguageSwitcher';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user) {
        navigate('/login');
      } else {
        setUser(data.session.user);
      }
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        navigate('/login');
      } else {
        setUser(session.user);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
      return;
    }
    navigate('/login');
  };

  // Listen for sidebar collapse state (you'll need to pass this from Sidebar)
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t('dashboard.loading')}</p>
      </div>
    );
  }

  const getSectionTitle = () => {
    const titles = {
      'dashboard': t('dashboard.title') || 'Dashboard',
      'add-task': 'Add Task',
      'tasks': 'Tasks',
      'activity': 'My Activity',
      'calendar': 'Calendar'
    };
    return titles[activeSection] || 'Dashboard';
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar 
        user={user}
        onLogout={logout}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <div className={`dashboard-main-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="page-title">{getSectionTitle()}</h1>
              <p className="page-subtitle">
                Welcome back, {user.email?.split('@')[0]}!
              </p>
            </div>
            
            <div className="header-right">
              <LanguageSwitcher />
              
              <button className="header-new-task-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {t('dashboard.newTask') || 'New Task'}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="dashboard-content">
            {activeSection === 'dashboard' && <TodoList />}
            {activeSection === 'tasks' && <TodoList />}
            {activeSection === 'add-task' && (
              <div>Add Task Form Component Here</div>
            )}
            {activeSection === 'activity' && (
              <div>Activity Component Here</div>
            )}
            {activeSection === 'calendar' && (
              <div>Calendar Component Here</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;