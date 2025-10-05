import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import supabase from '../database/superbaseClient';
import LanguageSwitcher from '../components/LanguageSwitcher';
import './Register&Login.css'; // ✅ same CSS file

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data?.user) {
      setMessage(t('auth.loginSuccessful'));
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    }
  };

  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: "http://localhost:5173/dashboard",
      },
    });

    if (error) {
      console.error("Google Auth Error:", error.message);
      setMessage(error.message);
    }
  };

  return (
    <div className="register-container">
      {/* Left Side - Illustration (reuse same) */}
      <div className="register-left">
        <div className="logo">
          <div className="logo-icon">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="logo-text">{t('app.name')}</span>
        </div>

        {/* <div className="illustration">
          <div className="task-checklist-card">
            <div className="task-item completed"><div className="checkbox checked"></div><div className="task-line"></div></div>
            <div className="task-item"><div className="checkbox"></div><div className="task-line"></div></div>
          </div>
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
        </div> */}


         <div className="illustration">
          <div className="illustration-bg"></div>
          
          {/* Main Task Checklist Card */}
          <div className="task-checklist-card">
            <div className="task-item completed">
              <div className="checkbox checked"></div>
              <div className="task-line"></div>
            </div>
            <div className="task-item completed">
              <div className="checkbox checked"></div>
              <div className="task-line"></div>
            </div>
            <div className="task-item">
              <div className="checkbox"></div>
              <div className="task-line"></div>
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="calendar-widget">
            <div className="calendar-header"></div>
            <div className="calendar-grid">
              <div className="calendar-dot"></div>
              <div className="calendar-dot active"></div>
              <div className="calendar-dot"></div>
              <div className="calendar-dot"></div>
            </div>
          </div>

          {/* Floating Task Card */}
          <div className="floating-task-card">
            <div className="task-priority high"></div>
            <div className="task-content">
              <div className="task-text short"></div>
              <div className="task-text long"></div>
            </div>
          </div>

          {/* Progress Circle */}
          <div className="progress-circle">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="8" 
                strokeDasharray="251" strokeDashoffset="62.75" 
                strokeLinecap="round" transform="rotate(-90 50 50)"/>
            </svg>
            <div className="progress-percentage">75%</div>
          </div>

          {/* Clock Icon */}
          <div className="clock-icon">
            <div className="clock-face">
              <div className="clock-hand hour"></div>
              <div className="clock-hand minute"></div>
            </div>
          </div>

          {/* Notification Badge */}
          <div className="notification-badge">
            <svg viewBox="0 0 24 24" fill="white">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
            </svg>
            <span className="badge-count">3</span>
          </div>

          {/* Floating shapes */}
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="register-right">
        <div className="register-header">
          <span className="sign-in-link">
            {t('auth.dontHaveAccount')} <Link to="/register">{t('auth.signupLink')}</Link>
          </span>
          <div style={{ marginLeft: '20px' }}>
            <LanguageSwitcher />
          </div>
        </div>

        <div className="register-form-wrapper">
          <h1>{t('auth.welcomeBack')}</h1>
          <p className="subtitle">{t('auth.loginToAccount')}</p>

          {message && (
            <div className={`message ${message.includes('successful') || message === t('auth.loginSuccessful') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="email">{t('auth.email')}</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('auth.password')}</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showPassword ? (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </>
                    ) : (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              {t('auth.login')}
            </button>
          </form>

          <div className="social-login">
            <p>{t('auth.orLoginWith')}</p>
            <div className="social-buttons">
              <button className="social-btn google" onClick={handleGoogleSignIn} aria-label="Login with Google">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
