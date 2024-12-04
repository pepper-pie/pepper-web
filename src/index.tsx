import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Navigation, NotificationsProvider } from '@toolpad/core';
import { AppProvider } from '@toolpad/core/react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';

const NAVIGATION: Navigation = [
  {
    segment: '',
    title: 'Home',
  },
  {
    segment: '/reports',
    pattern: '/reports',
    title: 'Dashboard ',
    children: [
      {
        pattern: 'account-summary',
        segment: 'reports/account-summary',
        title: "Account Summary",
      },
      {
        pattern: 'transactions',
        segment: 'reports/transactions',
        title: "Transactions"
      }
    ],
    icon: <DashboardIcon />,
  },
  {
    pattern: 'splitwise',
    segment: 'splitwise',
    title: 'Splitwise',
    icon: <TimelineIcon />,
  },
];


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider
        navigation={NAVIGATION}
      >
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
