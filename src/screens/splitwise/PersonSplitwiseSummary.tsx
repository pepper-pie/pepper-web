import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Column } from "react-table";
import ExcelTable from "../../components/ExcelTable";
import { useSearchParams } from "react-router-dom";
import { PageContainer, PageContainerToolbar } from "@toolpad/core";
import { styled } from "@mui/material/styles";
import { Box, Autocomplete, Button, TextField, IconButton, Tooltip } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SplitwiseModel from "../../models/transactions/splitwise-model";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { formatMoney, formattedDate } from "../../utils/string-utils";
import { SplitwiseTransaction, Friend } from "../../models/transactions/splitwise-types";
import RefreshIcon from '@mui/icons-material/Refresh';

dayjs.extend(utc);
dayjs.extend(timezone);

const PersonSplitwiseSummary: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Default date range: Last 3 months
    const currentDate = new Date();
    const defaultStartDate = dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1));
    const defaultEndDate = dayjs(new Date());

    // Extract filters from the URL or set defaults
    const person = searchParams.get("person") || ""; // Person ID
    const start_date = searchParams.get("start_date") || defaultStartDate.toISOString().split("T")[0];
    const end_date = searchParams.get("end_date") || defaultEndDate.toISOString().split("T")[0];

    // Update URL parameters
    const handleStartDateChange = (date: dayjs.Dayjs | null) => {
        setSearchParams({
            person,
            start_date: date ? dayjs(date).tz("Asia/Kolkata").format("YYYY-MM-DD") : "",
            end_date,
        });
    };

    const handleEndDateChange = (date: dayjs.Dayjs | null) => {
        setSearchParams({
            person,
            start_date,
            end_date: date ? dayjs(date).tz("Asia/Kolkata").format("YYYY-MM-DD") : "",
        });
    };

    const handlePersonChange = (friend: Friend | null) => {
        setSearchParams({
            person: friend ? String(friend.id) : "",
            start_date,
            end_date,
        });
    };

    // Fetch friends list using react-query
    const {
        data: friends = [],
        isLoading: isFriendsLoading,
        error: friendsError,
    } = useQuery({
        queryKey: ["splitwiseFriends"],
        queryFn: SplitwiseModel.fetchFriends,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    // Fetch transactions
    const { data: transactions, isFetching: isTransactionsLoading, error: transactionsError, refetch } = useQuery({
        queryKey: ["splitwiseTransactions", person, start_date, end_date],
        queryFn: () =>
            SplitwiseModel.fetchTransactions({
                person,
                start_date,
                end_date,
            }),
        enabled: !!person && !!start_date && !!end_date, // Fetch only if dates are available
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    const columns: Column<SplitwiseTransaction>[] = useMemo(
        () => [
            {
                Header: "Date",
                accessor: "date",
                Cell: ({ value }) => {
                    return <div style={{ textAlign: "right" }}>{formattedDate(value)}</div>;
                },
                width: 100,
            },
            {
                Header: "Narration",
                accessor: "narration",
                width: 500,
            },
            {
                Header: "Debit",
                accessor: "debit",
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{formatMoney(value)}</div>
                ),
            },
            {
                Header: "Credit",
                accessor: "credit",
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{formatMoney(value)}</div>
                ),
            },
            {
                Header: "Person Name",
                accessor: "person_name",
            },
            {
                Header: "Running Balance",
                accessor: "running_balance",
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{formatMoney(value)}</div>
                ),
            },
        ],
        []
    );

    return (
        <PageContainer
            style={{ maxWidth: "unset" }}
            slots={{
                toolbar: () => (
                    <PageContainerToolbar>
                        <Filters>
                            <Tooltip title="Refresh" >
                                <IconButton onClick={() => refetch()} disabled={isTransactionsLoading} >
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>
                            <Autocomplete
                                sx={{ width: 250 }}
                                options={friends}
                                getOptionLabel={(friend) => friend.name}
                                renderOption={(props, friend) => {
                                    const { key, ...optionProps } = props;
                                    return (
                                        <Box
                                            key={key}
                                            component="li"
                                            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                            {...optionProps}
                                        >
                                            <img
                                                src={friend.picture}
                                                alt={friend.name}
                                                style={{ width: 32, height: 32, borderRadius: "50%" }}
                                            />
                                            {friend.name}
                                        </Box>
                                    );
                                }}
                                value={friends.find((f) => String(f.id) === person) || null}
                                onChange={(e, value) => handlePersonChange(value)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Person"
                                        size="small"
                                        error={!!friendsError}
                                        helperText={friendsError ? "Error fetching friends" : ""}
                                    />
                                )}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                loading={isFriendsLoading}
                            />
                            <DatePicker
                                label="Start Date"
                                value={dayjs(start_date)}
                                onChange={handleStartDateChange}
                                format="DD-MM-YYYY"
                                slotProps={{ textField: { size: "small" } }}
                            />
                            <DatePicker
                                label="End Date"
                                value={dayjs(end_date)}
                                format="DD-MM-YYYY"
                                onChange={handleEndDateChange}
                                slotProps={{ textField: { size: "small" } }}
                            />
                            <Button variant="contained" onClick={() => setSearchParams({})}>
                                Reset Filters
                            </Button>
                        </Filters>
                    </PageContainerToolbar>
                ),
            }}
        >
            {isTransactionsLoading ? (
                <div>Loading...</div>
            ) : transactionsError ? (
                <div>Error loading transactions.</div>
                ) : (
                        <Box style={{ height: 'calc(100vh - 180px)' }} >
                            <ExcelTable columns={columns} data={transactions || []} />
                        </Box>
            )}
        </PageContainer>
    );
};

export default PersonSplitwiseSummary;

const Filters = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
}));