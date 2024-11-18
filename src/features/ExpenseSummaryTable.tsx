import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Column } from "react-table";
import ExcelTable from "../components/ExcelTable";
import TransactionModel from "../models/transactions/transaction-model";
import { formatMoney } from "./TransactionTable";
import { Box } from "@mui/material";

export interface ExpenseSummary {
    account_name: string;
    debit: number;
    credit: number;
    total: number;
}

const ExpenseSummaryTable: React.FC<{ month: number; year: number }> = ({ month, year }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["expenseSummary", month, year],
        queryFn: () => TransactionModel.fetchExpenseSummary(month, year),
        enabled: !!month && !!year,
        staleTime: 5 * 60 * 1000,
    });

    const columns: Column<ExpenseSummary>[] = useMemo(
        () => [
            {
                Header: "Account Name",
                accessor: "account_name",
                width: 200,
            },
            {
                Header: "Debit",
                accessor: "debit",
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{formatMoney(value)}</div>
                ),
                width: 150,
            },
            {
                Header: "Credit",
                accessor: "credit",
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{formatMoney(value)}</div>
                ),
                width: 150,
            },
            {
                Header: "Total",
                accessor: "total",
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{formatMoney(value)}</div>
                ),
                width: 150,
            },
        ],
        []
    );

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading expense summary.</div>;

    return (
        <Box mt={2} mb={2} >
            <ExcelTable columns={columns} data={data || []} />
        </Box>
    );
};

export default ExpenseSummaryTable;