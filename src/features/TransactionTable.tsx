import { Box, IconButton, Tooltip } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Column } from "react-table";
import ExcelTable from "../components/ExcelTable";
import TransactionModel from "../models/transactions/transaction-model";
import { Transaction } from "../models/transactions/transaction-types";
import { formatMoney } from "../utils/string-utils";
import RefreshIcon from '@mui/icons-material/Refresh';

interface TransactionsTableProps {
  month: number;
  year: number;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ month, year }) => {

  // Define the query directly in the component
  const { data: transactions = [], isLoading, error, refetch } = useQuery({
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
          Header: "ID",
          accessor: "id",
          Cell: ({ value }, index) => {
            console.log({ index })
            return <div style={{ textAlign: "right" }}>{value}</div>;
          },
          width: 64
        },
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
          },
          width: 87
        },
        { Header: "Narration", accessor: "narration" },
        {
          Header: "Debit Amount",
          accessor: "debit_amount", // Replace with the correct field name
          Cell: ({ value }) => {
            return <div style={{ textAlign: "right" }}>{formatMoney(value)}</div>;
          },
          width: 100
        },
        {
          Header: "Credit Amount",
          accessor: "credit_amount", // Replace with the correct field name
          Cell: ({ value }) => {
            return <div style={{ textAlign: "right" }}>{formatMoney(value)}</div>;
          },
          width: 100
        },
        { Header: "Category", accessor: "category", width: 123 },
        { Header: "Sub Category", accessor: "sub_category", width: 123 },
        { Header: "Personal Account", accessor: "personal_account", width: 123 },
        { Header: "Nominal Account", accessor: "nominal_account", width: 123 },
        {
          Header: "Running Balance", accessor: "running_balance",
          Cell: ({ value }) => {
            return <span style={{ textAlign: "right" }}>{formatMoney(value)}</span>;
          },
          width: 123
        },
      ]
      return cols
    },
    []
  );

  if (isLoading) return <p>Loading transactions...</p>;
  if (error)
    return <p>Error fetching transactions: {(error as Error).message}</p>;

  console.log('Hello')

  return (
    <div>
      <Tooltip title="Refresh" >
        <IconButton onClick={() => refetch()} disabled={isLoading} >
          <RefreshIcon />
        </IconButton>
      </Tooltip>
        <Box sx={{
        height: "calc(100vh - 250px)", // Full page height
          display: "flex",
          flexDirection: "column",
        }} >
        <ExcelTable columns={columns} data={transactions || []} />
      </Box>
    </div>
  );
};

export default TransactionsTable;

