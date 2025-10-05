import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import supabase from '../database/superbaseClient';
import TodoList from '../components/TodoList';
import AddTask from '../components/AddTask';
import TaskBoard from '../components/TaskBoard';
import ActivityWidget from '../components/ActivityWidget';
import CalendarWidget from '../components/CalendarWidget';
import Sidebar from '../components/Sidebar';
import LanguageSwitcher from '../components/LanguageSwitcher';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');

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
      'dashboard': t('sidebar.dashboard'),
      'add-task': t('sidebar.addTask'),
      'tasks': t('sidebar.tasks'),
      'activity': t('sidebar.myActivity'),
      'calendar': t('sidebar.calendar')
    };
    return titles[activeSection] || t('sidebar.dashboard');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <TodoList />;
      case 'add-task':
        return <AddTask />;
      case 'tasks':
        return <TaskBoard showControls={true} allowEdit={true} />;
      case 'activity':
        return <ActivityWidget />;
      case 'calendar':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <CalendarWidget defaultView="week" compact={false} showToolbar={true} />
            <TaskBoard showControls={true} allowEdit={true} />
          </div>
        );
      default:
        return <TodoList />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        user={user}
        onLogout={logout}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="dashboard-main-wrapper">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="page-title">{getSectionTitle()}</h1>
              <p className="page-subtitle">
                {t('dashboard.welcome')}, {user.email?.split('@')[0]}!
              </p>
            </div>
            
            <div className="header-right">
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <main className="dashboard-main">
          <div className="dashboard-content">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
