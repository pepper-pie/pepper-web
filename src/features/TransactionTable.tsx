import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Column } from "react-table";
import ExcelTable from "../components/ExcelTable";
import TransactionModel from "../models/transactions/transaction-model";
import { Transaction } from "../models/transactions/transaction-types";
import { Box } from "@mui/material";

interface TransactionsTableProps {
  month: number;
  year: number;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ month, year }) => {
  // Define the query directly in the component
    const { data: transactions = [], isLoading, error } = useQuery({
        queryKey: ["transactions", month, year], // Unique query key
        queryFn: () => TransactionModel.fetchTransactions(month, year),
        enabled: !!month && !!year,
        staleTime: 5 * 60 * 1000
  });

  // Table column definition
  const columns:Column<Transaction>[] = React.useMemo(
    () => {
      const cols: Column<Transaction>[] = [
        {
          Header: "Date",
          accessor: "date",
          Cell: ({ value }) => {
            // Format date
            const formattedDate = new Date(value).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }).replace(/\//g, "-"); // Replace slashes with dashes
            return <div style={{ textAlign: "right" }}>{formattedDate}</div>;
          }
        },
        { Header: "Narration", accessor: "narration" },
        {
          Header: "Debit Amount",
          accessor: "debit_amount", // Replace with the correct field name
          Cell: ({ value }) => {
            return <div style={{ textAlign: "right" }}>{formatMoney(value)}</div>;
          },
        },
        {
          Header: "Credit Amount",
          accessor: "credit_amount", // Replace with the correct field name
          Cell: ({ value }) => {
            return <div style={{ textAlign: "right" }}>{formatMoney(value)}</div>;
          },
        },
        { Header: "Category", accessor: "category" },
        { Header: "Sub Category", accessor: "sub_category" },
        { Header: "Personal Account", accessor: "personal_account" },
        { Header: "Nominal Account", accessor: "nominal_account" },
        {
          Header: "Running Balance", accessor: "running_balance",
          Cell: ({ value }) => {
            return <div style={{ textAlign: "right" }}>{formatMoney(value)}</div>;
          },
        },
      ]
      return cols
    },
    []
  );

  if (isLoading) return <p>Loading transactions...</p>;
  if (error)
    return <p>Error fetching transactions: {(error as Error).message}</p>;

  return (
    <div>
          <h1>Transactions</h1>
      <ErrorBoundary fallback={<div>Something went wrong</div>} >
        <Box sx={{
          height: "calc(100vh - 194px)", // Full page height
          display: "flex",
          flexDirection: "column",
        }} >
        <ExcelTable columns={columns} data={transactions || []} />
        </Box>
      </ErrorBoundary>
    </div>
  );
};

export default TransactionsTable;

export const formatMoney = (value: number) => {
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value || 0);
  return formattedAmount
}