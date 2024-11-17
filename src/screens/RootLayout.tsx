import React, { FC } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useSearchParams } from 'react-router-dom';
import { Button, ButtonGroup } from '@mui/material';
import TransactionsTable from '../features/TransactionTable';
import AccountSummaryTable from '../features/AccountSummaryTable';
import ExpenseSummaryTable from '../features/ExpenseSummaryTable';
import ExpensePivotTable from '../features/ExpensePivotTable';

// Styled components
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

const RootLayout: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current month and year
  const currentDate = new Date();
  const defaultMonth = currentDate.getMonth() + 1; // Months are 0-indexed
  const defaultYear = currentDate.getFullYear();

  // Extract filters from URL or use defaults
  const selectedMonth = parseInt(searchParams.get('month') || `${defaultMonth}`, 10);
  const selectedYear = parseInt(searchParams.get('year') || `${defaultYear}`, 10);
  const selectedTab = searchParams.get('tab') || 'reports';

  // Handle filter changes
  const handleMonthChange = (event: SelectChangeEvent<number>) => {
    setSearchParams({ month: `${event.target.value}`, year: `${selectedYear}`, tab: selectedTab });
  };

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSearchParams({ month: `${selectedMonth}`, year: `${event.target.value}`, tab: selectedTab });
  };

  const handleTabChange = (tab: string) => {
    setSearchParams({ month: `${selectedMonth}`, year: `${selectedYear}`, tab });
  };

  return (
    <RootLayoutContainer>
      <Header>
        <span>Transaction Viewer</span>
        <Box display="flex" alignItems="center" gap={2}>
          <Filters>
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              variant="outlined"
              size="small"
              sx={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
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
              sx={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <MenuItem key={i} value={defaultYear - i}>
                  {defaultYear - i}
                </MenuItem>
              ))}
            </Select>
          </Filters>
        </Box>
      </Header>
      <Content>
        <ButtonGroup>
          <Button
            variant={selectedTab === 'reports' ? 'contained' : 'outlined'}
            color='primary'
            onClick={() => handleTabChange('reports')}
          >
            Reports
          </Button>
          <Button
            variant={selectedTab === 'transactions' ? 'contained' : 'outlined'}
            color='primary'
            onClick={() => handleTabChange('transactions')}
          >
            Transactions
          </Button>
        </ButtonGroup>
        {/* Render content based on the selected tab */}
        {selectedTab === 'reports' ? (
          <Box display={'flex'} >
            <AccountSummaryTable month={selectedMonth} year={selectedYear} />
            <Box>
              <ExpenseSummaryTable month={selectedMonth} year={selectedYear} />
              <ExpensePivotTable month={selectedMonth} year={selectedYear} />
            </Box>
          </Box>
        ) : (
            <TransactionsTable month={selectedMonth} year={selectedYear} />
        )}
      </Content>
    </RootLayoutContainer>
  );
};

export default RootLayout;