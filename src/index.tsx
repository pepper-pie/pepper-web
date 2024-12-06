import CreditCard from '@mui/icons-material/CreditCard';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Home from '@mui/icons-material/Home';
import TimelineIcon from '@mui/icons-material/Timeline';
import { Navigation, NotificationsProvider } from '@toolpad/core';
import { AppProvider } from '@toolpad/core/react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

const NAVIGATION: Navigation = [
  {
    segment: '',
    title: 'Home',
    icon: <Home />,
  },
  {
    segment: '/reports',
    pattern: '/reports',
    title: 'Dashboard ',
    children: [
      {
        pattern: 'account-summary',
        segment: 'reports/account-summary',
        title: "Account Summary"
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
    pattern: "creditcard",
    segment: 'creditcard',
    title: 'Credit Card',
    icon: <CreditCard />
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
