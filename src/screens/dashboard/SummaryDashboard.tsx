import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { LoadingButton } from '@mui/lab';
import { Button, ButtonGroup } from '@mui/material';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { PageContainer, PageContainerToolbar } from '@toolpad/core';
import { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountSummaryTable from '../../features/AccountSummaryTable';
import ExpensePivotTable from '../../features/ExpensePivotTable';
import ExpenseSummaryTable from '../../features/ExpenseSummaryTable';
import TransactionsTable from '../../features/TransactionTable';
import TransactionModel from '../../models/transactions/transaction-model';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

// preview-start
function PageToolbar() {

    const [searchParams, setSearchParams] = useSearchParams();

    // Extract filters from URL or use defaults
    const selectedTab = searchParams.get('tab') || 'reports';

    // Get current month and year
    const currentDate = new Date();
    const defaultMonth = currentDate.getMonth() + 1; // Months are 0-indexed
    const defaultYear = currentDate.getFullYear();


    var selectedMonth = parseInt(searchParams.get('month') || `${defaultMonth}`, 10);
    var selectedYear = parseInt(searchParams.get('year') || `${defaultYear}`, 10);

    const downloadReportQuery = useQuery(
        {
            queryKey: [selectedMonth, selectedYear],
            queryFn: () => TransactionModel.downloadMonthlyReport(selectedMonth, selectedYear),
            enabled: false
        })

    // Handle filter changes
    const handleMonthChange = (event: SelectChangeEvent<number>) => {
        setSearchParams({ month: `${event.target.value}`, year: `${selectedYear}`, tab: selectedTab });
    };

    const handleYearChange = (event: SelectChangeEvent<number>) => {
        setSearchParams({ month: `${selectedMonth}`, year: `${event.target.value}`, tab: selectedTab });
    };

    const onUpload = (file?: File) => {
        if (file) {
            TransactionModel.uploadTransactions(file);
        } else {
            alert('Please select a file to upload.');
        }
    };


    return (
        <PageContainerToolbar>
            <Filters>
                <Button
                    component="label"
                    role={undefined}
                    tabIndex={-1}
                    endIcon={<FileUploadIcon />}
                >
                    <VisuallyHiddenInput
                        type="file"
                        onChange={(event) => onUpload(event.target.files?.[0])}
                        multiple
                    />
                    Upload Transaction
                </Button>
                <LoadingButton loading={downloadReportQuery.isLoading} variant='contained' endIcon={<DownloadIcon />}
                    onClick={e => downloadReportQuery.refetch()}
                >
                    Monthly Report
                </LoadingButton>
                <Select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    variant="outlined"
                    size="small"
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
                >
                    {Array.from({ length: 5 }, (_, i) => (
                        <MenuItem key={i} value={defaultYear - i}>
                            {defaultYear - i}
                        </MenuItem>
                    ))}
                </Select>
            </Filters>
        </PageContainerToolbar>
    );
}


const Filters = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
}));

const SummaryDashboard: FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Extract filters from URL or use defaults
    const selectedTab = searchParams.get('tab') || 'reports';

    // Get current month and year
    const currentDate = new Date();
    const defaultMonth = currentDate.getMonth() + 1; // Months are 0-indexed
    const defaultYear = currentDate.getFullYear();

    const selectedMonth = parseInt(searchParams.get('month') || `${defaultMonth}`, 10);
    const selectedYear = parseInt(searchParams.get('year') || `${defaultYear}`, 10);

    const handleTabChange = (tab: string) => {
        setSearchParams({ month: `${selectedMonth}`, year: `${selectedYear}`, tab });
    };

    return (
        <PageContainer
            slots={{ toolbar: PageToolbar }}
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
                    variant={selectedTab === 'transactions' ? 'contained' : 'outlined'}
                    color='primary'
                    onClick={() => handleTabChange('transactions')}
                >
                    Transactions
                </Button>
            </ButtonGroup>
            {selectedTab === 'reports' ? (
                <Box>
                    <AccountSummaryTable month={selectedMonth} year={selectedYear} />
                    <Box display={'flex'} width={'100%'} mt={2} >
                        <ExpenseSummaryTable month={selectedMonth} year={selectedYear} />
                        <ExpensePivotTable month={selectedMonth} year={selectedYear} />
                    </Box>
                </Box>
            ) : (
                <TransactionsTable month={selectedMonth} year={selectedYear} />
            )}
        </PageContainer>
    );
};

export default SummaryDashboard;