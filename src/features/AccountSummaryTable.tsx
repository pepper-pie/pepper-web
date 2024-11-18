import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Column } from "react-table";
import ExcelTable from "../components/ExcelTable";
import TransactionModel from "../models/transactions/transaction-model";
import { formatMoney } from "./TransactionTable";
import { Box } from "@mui/material";

export interface AccountSummary {
    account_name: string;
    opening_balance: number;
    debit: number;
    credit: number;
    closing_balance: number;
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

    // Define columns for the table
    const columns: Column<AccountSummary>[] = useMemo(
        () => [
            {
                Header: "Account Name",
                accessor: "account_name", // Key from API response
                width: 120
            },
            {
                Header: "Opening Balance",
                accessor: "opening_balance",
                Cell: ({ value }) => {
                    return <div style={{ textAlign: "right" }}>{formatMoney(value)}</div>;
                },
                width: 100
            },
            {
                Header: "Debit",
                accessor: "debit",
                Cell: ({ value }) => {
                    return <div style={{ textAlign: "right" }}>{formatMoney(value)}</div>;
                },
                width: 100
            },
            {
                Header: "Credit",
                accessor: "credit",
                Cell: ({ value }) => {
                    return <div style={{ textAlign: "right" }}>{formatMoney(value)}</div>;
                },
                width: 100
            },
            {
                Header: "Closing Balance",
                accessor: "closing_balance",
                Cell: ({ value }) => {
                    return <div style={{ textAlign: "right" }}>{formatMoney(value)}</div>;
                },
                width: 100
            },
        ],
        []
    );

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading account summaries.</div>;

    return <Box width={'70%'} mt={2} mr={2} >
        <ExcelTable columns={columns} data={data || []} />
    </Box>;
};

export default AccountSummaryTable;