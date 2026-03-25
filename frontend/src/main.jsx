import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider, App as AntApp } from 'antd';
import thTH from 'antd/locale/th_TH';
import { AuthProvider } from './context/AuthContext.jsx';
import App from './App.jsx';
import './App.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      locale={thTH}
      theme={{
        token: {
          colorPrimary: '#4f46e5',
          colorLink: '#4f46e5',
          borderRadius: 8,
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        },
        components: {
          Button: { primaryColor: '#fff' },
          Segmented: { itemSelectedBg: '#4f46e5', itemSelectedColor: '#fff' },
        },
      }}
    >
      <AntApp>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  </StrictMode>
);
