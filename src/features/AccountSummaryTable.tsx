import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { Column, RowPropGetter } from "react-table";
import ExcelTable from "../components/ExcelTable";
import TransactionModel from "../models/transactions/transaction-model";
import { formatMoney } from "../utils/string-utils";

export interface AccountSummary {
    account_name: string;
    opening_balance: number;
    debit: number;
    credit: number;
    closing_balance: number;
    freezing_date: string // date
}

const AccountSummaryTable: React.FC<{ month: number; year: number }> = ({ month, year }) => {
    // Fetch data using React Query
    const { data, isLoading, error } = useQuery(
        {
            queryKey: ["accountSummary", month, year],
            queryFn: () => TransactionModel.fetchAccountSummaries(month, year),
            enabled: !!month && !!year,
            staleTime: 5 * 60 * 1000
        }
    );

    const getRowProps: RowPropGetter<AccountSummary> = (row) => {
        return {
            style: {
                backgroundColor: true ? '#74C476' : 'transparent',
            },
        };
    };

    const isFreezed = (data: AccountSummary) => {
        let date = data.freezing_date;
        return Boolean(month === dayjs(date).month() + 1 && dayjs(date).isSame(dayjs(date).endOf('month'), 'date'))
    }

    // Define columns for the table
    const columns: Column<AccountSummary>[] = useMemo(
        () => [
            {
                Header: "Account Name",
                accessor: "account_name", // Key from API response
                width: 120,
                Cell: ({ value, row }) => {
                    row.getRowProps(getRowProps)
                    return <span style={{}}>{value}</span>;
                },
            },
            {
                Header: "Opening Balance",
                accessor: "opening_balance",
                Cell: ({ value, row }) => {
                    return <span style={{ textAlign: "right", }}>{formatMoney(value)}</span>;
                },
                width: 100
            },
            {
                Header: "Debit",
                accessor: "debit",
                Cell: ({ value }) => {
                    return <span style={{ textAlign: "right" }}>{formatMoney(value)}</span>;
                },
                width: 100
            },
            {
                Header: "Credit",
                accessor: "credit",
                Cell: ({ value }) => {
                    return <span style={{ textAlign: "right" }}>{formatMoney(value)}</span>;
                },
                width: 100
            },
            {
                Header: "Closing Balance",
                accessor: "closing_balance",
                Cell: ({ value }) => {
                    return <span style={{ textAlign: "right" }}>{formatMoney(value)}</span>;
                },
                width: 100
            },
        ],
        []
    );

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading account summaries.</div>;

    return <Box>
        <ExcelTable isRowHighlighted={isFreezed} highlightColor="#74C476" columns={columns} data={data || []} />
    </Box>;
};

export default AccountSummaryTable;