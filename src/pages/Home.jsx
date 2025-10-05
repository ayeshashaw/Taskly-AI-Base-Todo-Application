// Home.jsx
import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, Calendar, Globe, Menu, X, ChevronRight, 
  Sparkles, ArrowRight, BarChart3, Eye, CalendarCheck,
  Zap, Users, Shield, Target, TrendingUp, Layout
} from 'lucide-react';
import './Home.css';

const translations = {
  en: {
    nav: {
      login: 'Login',
      signup: 'Sign up'
    },
    hero: {
      title1: 'Revolutionise',
      title2: 'your productivity',
      title3: 'with',
      titleHighlight: 'Taskly!',
      subtitle: 'We empower your business by keeping everyone accountable for their work.',
      cta: 'Request a demo',
      badge: "It's the high time for change"
    },
    section: {
      title: 'Manage your timeline with',
      subtitle: 'unparalleled efficiency',
      description: 'Experience the ultimate task management solution designed to suit all styles of work, with an all-in-one tool that streamlines your workflow and simplifies your daily tasks.'
    },
    features: {
      dashboard: {
        title: 'Task timelines dashboard',
        description: 'Experience the ultimate task management solution designed to suit all styles of work, with an all-in-one tool that streamlines workflow and simplifies your daily tasks.'
      },
      visualize: {
        title: 'Visualise complex timelines',
        description: 'Experience the ultimate task management solution designed to suit all styles of work, with an all-in-one tool that streamlines workflow and simplifies your daily tasks.'
      },
      calendar: {
        title: 'Calendar & task management',
        description: 'Experience the ultimate task management solution designed to suit all styles of work, with an all-in-one tool that streamlines workflow and simplifies your daily tasks.'
      }
    },
    additionalFeatures: {
      title: 'Everything you need to stay productive',
      ai: {
        title: 'AI Task Generator',
        description: 'Let AI suggest tasks based on your goals. Get 3-5 smart recommendations instantly.'
      },
      multilingual: {
        title: 'Multilingual Support',
        description: 'Work in your preferred language. Full support for English and Hindi with more coming soon.'
      },
      secure: {
        title: 'Secure & Private',
        description: 'Your data is encrypted and secure. Only you have access to your tasks and information.'
      },
      realtime: {
        title: 'Real-time Updates',
        description: 'Changes sync instantly across all your devices. Stay updated wherever you are.'
      },
      dashboard: {
        title: 'Smart Dashboard',
        description: 'Visual insights into your productivity. Track progress and manage tasks efficiently.'
      },
      search: {
        title: 'Quick Search & Filter',
        description: 'Find any task instantly with powerful search and smart filtering options.'
      }
    },
    cta: {
      title: 'Ready to boost your productivity?',
      subtitle: 'Join thousands of teams already using Taskly to manage their daily tasks efficiently.',
      button: 'Get Started Free'
    }
  },
  hi: {
    nav: {
      features: 'विशेषताएं',
      about: 'हमारे बारे में',
      blog: 'ब्लॉग',
      contact: 'संपर्क करें',
      login: 'लॉगिन',
      signup: 'साइन अप करें'
    },
    hero: {
      title1: 'क्रांति लाएं',
      title2: 'अपनी उत्पादकता में',
      title3: 'के साथ',
      titleHighlight: 'Taskly!',
      subtitle: 'हम आपके व्यवसाय को सशक्त बनाते हैं और सभी को उनके काम के लिए जवाबदेह रखते हैं।',
      cta: 'डेमो का अनुरोध करें',
      badge: 'बदलाव का समय आ गया है'
    },
    section: {
      title: 'अपनी समयरेखा प्रबंधित करें',
      subtitle: 'अद्वितीय दक्षता के साथ',
      description: 'अंतिम कार्य प्रबंधन समाधान का अनुभव करें जो सभी कार्य शैलियों के अनुकूल है, एक ऑल-इन-वन टूल के साथ जो आपके वर्कफ़्लो को सुव्यवस्थित करता है।'
    },
    features: {
      dashboard: {
        title: 'कार्य समयरेखा डैशबोर्ड',
        description: 'सभी कार्य शैलियों के अनुकूल अंतिम कार्य प्रबंधन समाधान का अनुभव करें, जो वर्कफ़्लो को सरल बनाता है।'
      },
      visualize: {
        title: 'जटिल समयरेखाओं की कल्पना करें',
        description: 'सभी कार्य शैलियों के अनुकूल अंतिम कार्य प्रबंधन समाधान का अनुभव करें, जो वर्कफ़्लो को सरल बनाता है।'
      },
      calendar: {
        title: 'कैलेंडर और कार्य प्रबंधन',
        description: 'सभी कार्य शैलियों के अनुकूल अंतिम कार्य प्रबंधन समाधान का अनुभव करें, जो वर्कफ़्लो को सरल बनाता है।'
      }
    },
    additionalFeatures: {
      title: 'उत्पादक बने रहने के लिए आवश्यक सब कुछ',
      ai: {
        title: 'AI कार्य जनरेटर',
        description: 'अपने लक्ष्यों के आधार पर AI को कार्य सुझाने दें। तुरंत 3-5 स्मार्ट सिफारिशें प्राप्त करें।'
      },
      multilingual: {
        title: 'बहुभाषी समर्थन',
        description: 'अपनी पसंदीदा भाषा में काम करें। अंग्रेजी और हिंदी के लिए पूर्ण समर्थन।'
      },
      secure: {
        title: 'सुरक्षित और निजी',
        description: 'आपका डेटा एन्क्रिप्टेड और सुरक्षित है। केवल आपके पास अपने कार्यों तक पहुंच है।'
      },
      realtime: {
        title: 'रियल-टाइम अपडेट',
        description: 'सभी उपकरणों पर परिवर्तन तुरंत सिंक होते हैं। कहीं भी अपडेट रहें।'
      },
      dashboard: {
        title: 'स्मार्ट डैशबोर्ड',
        description: 'अपनी उत्पादकता में दृश्य अंतर्दृष्टि। प्रगति को ट्रैक करें और कार्यों को कुशलता से प्रबंधित करें।'
      },
      search: {
        title: 'त्वरित खोज और फ़िल्टर',
        description: 'शक्तिशाली खोज और स्मार्ट फ़िल्टरिंग विकल्पों के साथ कोई भी कार्य तुरंत खोजें।'
      }
    },
    cta: {
      title: 'अपनी उत्पादकता बढ़ाने के लिए तैयार हैं?',
      subtitle: 'हजारों टीमें पहले से ही Taskly का उपयोग करके अपने दैनिक कार्यों को कुशलता से प्रबंधित कर रही हैं।',
      button: 'मुफ्त शुरू करें'
    }
  }
};

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang) setLanguage(savedLang);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('preferred-language', lang);
  };

  const t = translations[language];

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleSignup = () => {
    window.location.href = '/register';
  };

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">
              <div className="logo-square"></div>
              <div className="logo-square"></div>
              <div className="logo-square"></div>
              <div className="logo-square"></div>
            </div>
            <span className="logo-text">Taskly</span>
          </div>

          <button className="nav-mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

  

          <div className="nav-actions">
            <button className="lang-switcher" onClick={() => changeLanguage(language === 'en' ? 'hi' : 'en')}>
              <Globe size={18} />
              <span>{language === 'en' ? 'EN' : 'हि'}</span>
            </button>
            <button className="btn-text" onClick={handleLogin}>{t.nav.login}</button>
            <button className="btn-primary" onClick={handleSignup}>{t.nav.signup}</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-left">
            <div className="hero-content">
              <h1 className="hero-title">
                <span className="hero-title-line">{t.hero.title1}</span>
                <span className="hero-title-line">{t.hero.title2}</span>
                <span className="hero-title-line">
                  {t.hero.title3} <span className="hero-title-highlight">{t.hero.titleHighlight}</span>
                </span>
              </h1>
              
              <div className="hero-subtitle">
                <div className="hero-avatars">
                  <div className="avatar avatar-1"></div>
                  <div className="avatar avatar-2"></div>
                  <div className="avatar avatar-3"></div>
                  <div className="avatar avatar-count">12+</div>
                </div>
                <p>{t.hero.subtitle}</p>
              </div>

              <div className="hero-cta">
                <button className="btn-cta">
                  {t.hero.cta}
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
              <div className="hero-person">
                <div className="person-image"></div>
              </div>
              
              <div className="hero-card hero-card-change">
                <Sparkles size={20} className="card-icon" />
                <span>{t.hero.badge}</span>
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
              {t.section.title}<br />
              <span className="features-title-highlight">{t.section.subtitle}</span>
            </h2>
            <p className="features-description">{t.section.description}</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon feature-icon-blue">
                <BarChart3 size={32} />
              </div>
              <h3 className="feature-title">{t.features.dashboard.title}</h3>
              <p className="feature-description">{t.features.dashboard.description}</p>
              <button className="feature-link">
                <ArrowRight size={20} />
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon-purple">
                <Eye size={32} />
              </div>
              <h3 className="feature-title">{t.features.visualize.title}</h3>
              <p className="feature-description">{t.features.visualize.description}</p>
              <button className="feature-link">
                <ArrowRight size={20} />
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon-blue">
                <CalendarCheck size={32} />
              </div>
              <h3 className="feature-title">{t.features.calendar.title}</h3>
              <p className="feature-description">{t.features.calendar.description}</p>
              <button className="feature-link">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="additional-features">
        <div className="additional-features-container">
          <h2 className="additional-features-title">{t.additionalFeatures.title}</h2>
          
          <div className="additional-features-grid">
            <div className="additional-feature-card">
              <div className="additional-feature-icon ai-gradient">
                <Zap size={28} />
              </div>
              <h3>{t.additionalFeatures.ai.title}</h3>
              <p>{t.additionalFeatures.ai.description}</p>
            </div>

            <div className="additional-feature-card">
              <div className="additional-feature-icon multilingual-gradient">
                <Globe size={28} />
              </div>
              <h3>{t.additionalFeatures.multilingual.title}</h3>
              <p>{t.additionalFeatures.multilingual.description}</p>
            </div>

            <div className="additional-feature-card">
              <div className="additional-feature-icon secure-gradient">
                <Shield size={28} />
              </div>
              <h3>{t.additionalFeatures.secure.title}</h3>
              <p>{t.additionalFeatures.secure.description}</p>
            </div>

            <div className="additional-feature-card">
              <div className="additional-feature-icon realtime-gradient">
                <TrendingUp size={28} />
              </div>
              <h3>{t.additionalFeatures.realtime.title}</h3>
              <p>{t.additionalFeatures.realtime.description}</p>
            </div>

            <div className="additional-feature-card">
              <div className="additional-feature-icon dashboard-gradient">
                <Layout size={28} />
              </div>
              <h3>{t.additionalFeatures.dashboard.title}</h3>
              <p>{t.additionalFeatures.dashboard.description}</p>
            </div>

            <div className="additional-feature-card">
              <div className="additional-feature-icon search-gradient">
                <Target size={28} />
              </div>
              <h3>{t.additionalFeatures.search.title}</h3>
              <p>{t.additionalFeatures.search.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">{t.cta.title}</h2>
            <p className="cta-subtitle">{t.cta.subtitle}</p>
            <button className="cta-button" onClick={handleSignup}>
              {t.cta.button}
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
              <div className="logo-icon">
                <div className="logo-square"></div>
                <div className="logo-square"></div>
                <div className="logo-square"></div>
                <div className="logo-square"></div>
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