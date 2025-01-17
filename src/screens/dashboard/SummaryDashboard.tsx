import { Button, ButtonGroup } from '@mui/material';
import Box from '@mui/material/Box';
import { PageContainer } from '@toolpad/core';
import { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountSummaryTable from '../../features/AccountSummaryTable';
import ExpensePivotTable from '../../features/ExpensePivotTable';

const SummaryDashboard: FC<{ month: number, year: number }> = ({ month, year }) => {

    const [searchParams, setSearchParams] = useSearchParams();

    // Extract filters from URL or use defaults
    const selectedTab = searchParams.get('tab') || 'reports';

    const handleTabChange = (tab: string) => {
        let allParams: Record<string, string> = {};
        searchParams.forEach((v, k) => { allParams[k] = v })
        setSearchParams({ ...allParams, tab });
    };

    return (
        <PageContainer
            style={{ maxWidth: 'unset' }}
        >
            <ButtonGroup sx={{ mb: 2 }} >
                <Button
                    variant={selectedTab === 'reports' ? 'contained' : 'outlined'}
                    color='primary'
                    onClick={() => handleTabChange('reports')}
                >
                    Reports
                </Button>
                <Button
                    variant={selectedTab === 'expenses' ? 'contained' : 'outlined'}
                    color='primary'
                    onClick={() => handleTabChange('expenses')}
                >
                    Expenses
                </Button>
            </ButtonGroup>
            {selectedTab === 'reports' ? (
                <Box>
                    <AccountSummaryTable month={month} year={year} />
                    <Box display={'flex'} width={'100%'} mt={2} >
                    </Box>
                </Box>
            ) : (
                    <ExpensePivotTable month={month} year={year} />
            )}
        </PageContainer>
    );
};

export default SummaryDashboard;