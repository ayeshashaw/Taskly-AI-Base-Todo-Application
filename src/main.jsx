import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { TodoProvider } from './context/TodoContext.jsx';
import './i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { BrowserRouter as Router } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <TodoProvider>
        <Router>
          <App />
        </Router>
      </TodoProvider>
    </I18nextProvider>
  </StrictMode>
);
