import React, { FC } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useSearchParams } from 'react-router-dom';
import TransactionsTable from '../features/TransactionTable';

// Define styled components using MUI's `styled` API
const RootLayoutContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

const Header = styled(Box)(({ theme }) => ({
  height: '64px',
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 3),
  color: theme.palette.primary.contrastText,
  fontSize: '1.5rem',
  fontWeight: 'bold',
}));

const Filters = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const Content = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  overflow: 'auto',
  padding: theme.spacing(3),
}));

const RootLayout: FC = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current month and year
  const currentDate = new Date();
  const defaultMonth = currentDate.getMonth() + 1; // Months are 0-indexed
  const defaultYear = currentDate.getFullYear();

  // Extract filters from URL or use defaults
  const selectedMonth = parseInt(searchParams.get('month') || `${defaultMonth}`, 10);
  const selectedYear = parseInt(searchParams.get('year') || `${defaultYear}`, 10);

  // Handle filter changes
  const handleMonthChange = (event: SelectChangeEvent<number>) => {
    setSearchParams({ month: `${event.target.value}`, year: `${selectedYear}` });
  };

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSearchParams({ month: `${selectedMonth}`, year: `${event.target.value}` });
  };

  return (
    <RootLayoutContainer>
      <Header>
        <span>Transaction Viewer</span>
        <Filters>
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            variant="outlined"
            size="small"
            style={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            variant="outlined"
            size="small"
            style={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <MenuItem key={i} value={defaultYear - i}>
                {defaultYear - i}
              </MenuItem>
            ))}
          </Select>
        </Filters>
          </Header>
      <Content>
        <TransactionsTable month={selectedMonth} year={selectedYear} />
      </Content>
    </RootLayoutContainer>
  );
};

export default RootLayout;