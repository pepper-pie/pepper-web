import { useQuery } from "@tanstack/react-query";
import React from "react";
import ExcelTable from "../components/ExcelTable";
import TransactionModel from "../models/transactions/transaction-model";
import { ErrorBoundary } from "react-error-boundary";
import { Column } from "react-table";
import { Transaction } from "../models/transactions/transaction-types";

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
    () => [
      { Header: "Date", accessor: "date" },
      { Header: "Narration", accessor: "narration" },
      { Header: "Debit Amount", accessor: "debit_amount" },
      { Header: "Credit Amount", accessor: "credit_amount" },
      { Header: "Category", accessor: "category" },
      { Header: "Sub Category", accessor: "sub_category" },
      { Header: "Personal Account", accessor: "personal_account" },
      { Header: "Nominal Account", accessor: "nominal_account" },
      { Header: "Running Balance", accessor: "running_balance" },
    ],
    []
  );

  if (isLoading) return <p>Loading transactions...</p>;
  if (error)
    return <p>Error fetching transactions: {(error as Error).message}</p>;

  return (
    <div>
          <h1>Transactions</h1>
      <ErrorBoundary fallback={<div>Something went wrong</div>} >
        <ExcelTable columns={columns} data={transactions || []} />
      </ErrorBoundary>
    </div>
  );
};

export default TransactionsTable;