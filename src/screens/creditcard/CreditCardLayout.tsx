import { Autocomplete, Box, Button, ButtonGroup, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { PageContainer, PageContainerToolbar } from '@toolpad/core';
import { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import CreditCardModel from '../../models/creditcard/creditcard-model';
import { CreditCard } from '../../models/creditcard/creditcard-types';
import CreditCardSummaryScreen from './CreditCardSummaryScreen';
import CreditCardTransactions from './CreditCardTransactions';

export interface CreditCardLayoutProps { }

const CreditCardLayout: FC<CreditCardLayoutProps> = (props) => {

    const [searchParams, _] = useSearchParams();

    // Get current month and year
    const currentDate = new Date();
    const defaultMonth = currentDate.getMonth();
    const defaultYear = currentDate.getFullYear();

    const selectedTab = searchParams.get('tab') || 'summary';
    const cc_id = Number(searchParams.get("cc_id")); // Person ID
    var selectedMonth = parseInt(searchParams.get('month') || `${defaultMonth}`, 10);
    var selectedYear = parseInt(searchParams.get('year') || `${defaultYear}`, 10);

    const { data: cardSummary } = useQuery({
        queryKey: [searchParams.toString()],
        queryFn: () => CreditCardModel.fetchSummary({ credit_card_id: cc_id, month: selectedMonth, year: selectedYear }),
        enabled: !!cc_id && !!selectedMonth && !!selectedYear
    })

    const { data: ccTrend } = useQuery({
        queryKey: [cc_id],
        queryFn: () => CreditCardModel.fetchCreditCardTrend(cc_id),
        enabled: !!cc_id
    })

    return (
        <PageContainer
            slots={{ toolbar: PageToolbar }}
            style={{ maxWidth: 'unset' }}
        >
            {
                cardSummary ?
                    <>
                        {
                            selectedTab == 'summary' ?
                                <CreditCardSummaryScreen cardSummary={cardSummary} ccTrend={ccTrend || []} />
                                : <CreditCardTransactions transactions={cardSummary.transactions} />
                        }
                    </>
                    : null
            }
        </PageContainer>
    )
}



export default CreditCardLayout


// preview-start
function PageToolbar() {

    const [searchParams, setSearchParams] = useSearchParams();


    // Get current month and year
    const currentDate = new Date();
    const defaultMonth = currentDate.getMonth();
    const defaultYear = currentDate.getFullYear();

    const selectedTab = searchParams.get('tab') || 'summary';
    const cc_id = searchParams.get("cc_id") || ""; // Person ID
    var selectedMonth = parseInt(searchParams.get('month') || `${defaultMonth}`, 10);
    var selectedYear = parseInt(searchParams.get('year') || `${defaultYear}`, 10);

    const fetchCreditCards = useQuery({
        queryKey: ['creditcard'],
        queryFn: CreditCardModel.fetchCreditCards
    })

    const fetchReport = useQuery(
        {
            queryKey: [selectedMonth, selectedYear],
            queryFn: () => { },
            enabled: false
        })

    // Handle filter changes
    const handleMonthChange = (event: SelectChangeEvent<number>) => {
        setSearchParams({ month: `${event.target.value}`, year: `${selectedYear}`, cc_id, tab: selectedTab });
    };

    const handleYearChange = (event: SelectChangeEvent<number>) => {
        setSearchParams({ month: `${selectedMonth}`, year: `${event.target.value}`, cc_id, tab: selectedTab });
    };

    const handleCreditCardChange = (creditCard: CreditCard | null) => {
        setSearchParams({
            cc_id: creditCard ? String(creditCard.id) : "",
            month: String(selectedMonth),
            year: String(selectedYear),
            tab: selectedTab
        });
    };

    const handleTabChange = (tab: string) => {
        setSearchParams({
            month: `${selectedMonth}`,
            year: `${selectedYear}`,
            tab,
            cc_id
        });
    };

    return (
        <PageContainerToolbar>
            <Filters>
                <ButtonGroup>
                    <Button
                        variant={selectedTab === 'summary' ? 'contained' : 'outlined'}
                        color='primary'
                        onClick={() => handleTabChange('summary')}
                    >
                        Summary
                    </Button>
                    <Button
                        variant={selectedTab === 'transactions' ? 'contained' : 'outlined'}
                        color='primary'
                        onClick={() => handleTabChange('transactions')}
                    >
                        Transactions
                    </Button>
                </ButtonGroup>
                <Autocomplete
                    sx={{ width: 250 }}
                    options={fetchCreditCards.data || []}
                    getOptionLabel={(cc) => cc.personal_account.name}
                    renderOption={(props, cc) => {
                        const { key, ...optionProps } = props;
                        return (
                            <Box
                                key={key}
                                component="li"
                                sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                {...optionProps}
                            >
                                {cc.personal_account.name}
                            </Box>
                        );
                    }}
                    value={fetchCreditCards.data?.find((f) => String(f.id) === cc_id) || null}
                    onChange={(e, value) => handleCreditCardChange(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Card"
                            size="small"
                            error={!!fetchCreditCards.error}
                            helperText={fetchCreditCards.error ? "Error fetching friends" : ""}
                        />
                    )}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    loading={fetchCreditCards.isLoading}
                />
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
