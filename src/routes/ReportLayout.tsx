import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { PageContainer, PageContainerToolbar } from '@toolpad/core';
import { FC } from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import TransactionsTable from '../features/TransactionTable';
import TransactionModel from '../models/transactions/transaction-model';
import SummaryDashboard from '../screens/dashboard/SummaryDashboard';

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

    let allParams: Record<string, string> = {};
    searchParams.forEach((v, k) => { allParams[k] = v })


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
        setSearchParams({ ...allParams, month: `${event.target.value}` });
    };

    const handleYearChange = (event: SelectChangeEvent<number>) => {
        setSearchParams({ ...allParams, year: `${event.target.value}` });
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

const ReportLayout: FC = () => {
    const [searchParams,] = useSearchParams();

    // Get current month and year
    const currentDate = new Date();
    const defaultMonth = currentDate.getMonth() + 1; // Months are 0-indexed
    const defaultYear = currentDate.getFullYear();

    const selectedMonth = parseInt(searchParams.get('month') || `${defaultMonth}`, 10);
    const selectedYear = parseInt(searchParams.get('year') || `${defaultYear}`, 10);


    return (
        <PageContainer
            slots={{ toolbar: PageToolbar }}
            style={{ maxWidth: 'unset' }}
        >
            <Routes>
                <Route path={`account-summary`} element={<SummaryDashboard month={selectedMonth} year={selectedYear} />} />
                <Route path={`transactions`} element={<TransactionsTable month={selectedMonth} year={selectedYear} />} />
            </Routes>
        </PageContainer>
    );
};

export default ReportLayout;