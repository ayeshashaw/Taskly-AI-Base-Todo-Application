import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, Calendar, Globe, Menu, X, ChevronRight, 
  Sparkles, ArrowRight, BarChart3, Eye, CalendarCheck,
  Zap, Users, Shield, Target, TrendingUp, Layout, Check
} from 'lucide-react';
import './Home.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const {t, i18n} = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState(i18n.language);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/register');
  };

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon-wrapper">
              <CheckSquare size={28} strokeWidth={2.5} className="logo-check-icon" />
            </div>
            <span className="logo-text">Taskly</span>
          </div>

          <button className="nav-mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`nav-actions ${isMenuOpen ? 'nav-actions-open' : ''}`}>
            <button className="lang-switcher" onClick={() => changeLanguage(language === 'en' ? 'hi' : 'en')}>
              <Globe size={18} />
              <span>{language === 'en' ? 'EN' : 'हि'}</span>
            </button>
            <button className="btn-text" onClick={handleLogin}>{t('home.nav.login')}</button>
            <button className="btn-primary" onClick={handleSignup}>{t('home.nav.signup')}</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-left">
            <div className="hero-content">
              <h1 className="hero-title">
                <span className="hero-title-line">{t('home.hero.title1')}</span>
                <span className="hero-title-line">{t('home.hero.title2')}</span>
                <span className="hero-title-line">
                  {t('home.hero.title3')} <span className="hero-title-highlight">{t('home.hero.titleHighlight')}</span>
                </span>
              </h1>
              
              <div className="hero-subtitle">
                <div className="hero-avatars">
                  <div className="avatar avatar-1"></div>
                  <div className="avatar avatar-2"></div>
                  <div className="avatar avatar-3"></div>
                  <div className="avatar avatar-count">12+</div>
                </div>
                <p>{t('home.hero.subtitle')}</p>
              </div>

              <div className="hero-cta">
                <button className="btn-cta" onClick={() => navigate('/register')}>
                  {t('home.hero.cta')}
                  <ChevronRight size={20} />
                </button>
                <button className="btn-play">
                  <div className="play-icon">▶</div>
                </button>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-image">
              {/* Main purple card with tasks */}
              <div className="hero-person">
                <div className="task-card-list">
                  <div className="task-item completed">
                    <div className="task-checkbox checked">
                      <Check size={16} strokeWidth={3} />
                    </div>
                    <div className="task-bar task-bar-long"></div>
                  </div>
                  <div className="task-item completed">
                    <div className="task-checkbox checked">
                      <Check size={16} strokeWidth={3} />
                    </div>
                    <div className="task-bar task-bar-medium"></div>
                  </div>
                  <div className="task-item">
                    <div className="task-checkbox"></div>
                    <div className="task-bar task-bar-long"></div>
                  </div>
                </div>
              </div>
              
              <div className="hero-card hero-card-change">
                <Sparkles size={20} className="card-icon" />
                <span>{t('home.hero.badge')}</span>
              </div>

              <div className="hero-card hero-card-chart">
                <div className="chart-header">
                  <span>Work summary</span>
                  <select className="chart-year">
                    <option>Year 2025</option>
                  </select>
                </div>
                <div className="chart-area">
                  <svg viewBox="0 0 300 100" className="area-chart">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ff9f7f" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#ffd4a3" stopOpacity="0.1"/>
                      </linearGradient>
                    </defs>
                    <path d="M 0 80 L 30 75 L 60 65 L 90 70 L 120 50 L 150 45 L 180 55 L 210 40 L 240 35 L 270 45 L 300 40 L 300 100 L 0 100 Z" 
                          fill="url(#chartGradient)" />
                    <path d="M 0 80 L 30 75 L 60 65 L 90 70 L 120 50 L 150 45 L 180 55 L 210 40 L 240 35 L 270 45 L 300 40" 
                          fill="none" stroke="#ff9f7f" strokeWidth="2" />
                  </svg>
                  <div className="chart-tooltip">
                    <div className="tooltip-value">100</div>
                    <div className="tooltip-label">5 tasks</div>
                  </div>
                </div>
              </div>

              <div className="hero-card hero-card-profile">
                <div className="profile-avatar"></div>
                <div className="profile-info">
                  <div className="profile-name">Sourav Deb</div>
                  <div className="profile-role">Mentor at Taskly</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="features" id="features">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">
              {t('home.section.title')}<br />
              <span className="features-title-highlight">{t('home.section.subtitle')}</span>
            </h2>
            <p className="features-description">{t('home.section.description')}</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon feature-icon-blue">
                <BarChart3 size={32} />
              </div>
              <h3 className="feature-title">{t('home.features.dashboard.title')}</h3>
              <p className="feature-description">{t('home.features.dashboard.description')}</p>
              <button className="feature-link">
                <ArrowRight size={20} />
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon-purple">
                <Eye size={32} />
              </div>
              <h3 className="feature-title">{t('home.features.visualize.title')}</h3>
              <p className="feature-description">{t('home.features.visualize.description')}</p>
              <button className="feature-link">
                <ArrowRight size={20} />
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon-blue">
                <CalendarCheck size={32} />
              </div>
              <h3 className="feature-title">{t('home.features.calendar.title')}</h3>
              <p className="feature-description">{t('home.features.calendar.description')}</p>
              <button className="feature-link">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="engaging-section">
            <h2>{t('home.engagingSection.title')}</h2>
            <ul>
              <li>{t('home.engagingSection.intuitiveDesign')}</li>
              <li>{t('home.engagingSection.fastSecureReliable')}</li>
              <li>{t('home.engagingSection.smartReminders')}</li>
              <li>{t('home.engagingSection.collaborativeFeatures')}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="additional-features">
        <div className="additional-features-container">
          <h2 className="additional-features-title">{t('home.additionalFeatures.title')}</h2>
          
          <div className="additional-features-grid">
            <div className="additional-feature-card">
              <div className="additional-feature-icon ai-gradient">
                <Zap size={28} />
              </div>
              <h3>{t('home.additionalFeatures.ai.title')}</h3>
              <p>{t('home.additionalFeatures.ai.description')}</p>
            </div>

            <div className="additional-feature-card">
              <div className="additional-feature-icon multilingual-gradient">
                <Globe size={28} />
              </div>
              <h3>{t('home.additionalFeatures.multilingual.title')}</h3>
              <p>{t('home.additionalFeatures.multilingual.description')}</p>
            </div>

            <div className="additional-feature-card">
              <div className="additional-feature-icon secure-gradient">
                <Shield size={28} />
              </div>
              <h3>{t('home.additionalFeatures.secure.title')}</h3>
              <p>{t('home.additionalFeatures.secure.description')}</p>
            </div>

            <div className="additional-feature-card">
              <div className="additional-feature-icon realtime-gradient">
                <TrendingUp size={28} />
              </div>
              <h3>{t('home.additionalFeatures.realtime.title')}</h3>
              <p>{t('home.additionalFeatures.realtime.description')}</p>
            </div>

            <div className="additional-feature-card">
              <div className="additional-feature-icon dashboard-gradient">
                <Layout size={28} />
              </div>
              <h3>{t('home.additionalFeatures.dashboard.title')}</h3>
              <p>{t('home.additionalFeatures.dashboard.description')}</p>
            </div>

            <div className="additional-feature-card">
              <div className="additional-feature-icon search-gradient">
                <Target size={28} />
              </div>
              <h3>{t('home.additionalFeatures.search.title')}</h3>
              <p>{t('home.additionalFeatures.search.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">{t('home.cta.title')}</h2>
            <p className="cta-subtitle">{t('home.cta.subtitle')}</p>
            <button className="cta-button" onClick={() => navigate('/register')}>
              {t('home.cta.button')}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo-icon-wrapper">
                <CheckSquare size={24} strokeWidth={2.5} className="logo-check-icon" />
              </div>
              <span className="logo-text">Taskly</span>
            </div>
            <p className="footer-text">© 2025 Taskly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;