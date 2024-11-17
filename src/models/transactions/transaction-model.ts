import { AccountSummary } from "../../features/AccountSummaryTable";
import { CategorisedExpenseSummary } from "../../features/ExpensePivotTable";
import { ExpenseSummary } from "../../features/ExpenseSummaryTable";
import { request } from "../../utils/axios-utils";
import { Transaction } from "./transaction-types";

class TransactionModel {
    /**
     * Fetch transactions for a given month and year.
     * 
     * @param month - The month for which transactions are needed (1-12).
     * @param year - The year for which transactions are needed (e.g., 2023).
     * @returns Promise<Transaction[]> - A promise that resolves to an array of transactions.
     */
    static async fetchTransactions(month: number, year: number): Promise<Transaction[]> {
        // Using the request function to make an API call
        return request<Transaction[]>({
            url: "transactions",
            params: { month, year },
        });
    }

    /**
     * Fetch account summaries for a given month and year.
     * 
     * @param month - The month for which account summaries are needed (1-12).
     * @param year - The year for which account summaries are needed (e.g., 2023).
     * @returns Promise<AccountSummary[]> - A promise that resolves to an array of account summaries.
     */
    static async fetchAccountSummaries(month: number, year: number): Promise<AccountSummary[]> {
        // Using the request function to make an API call
        return request<AccountSummary[]>({
            url: "monthly-report",
            params: { month, year, format: "json" }, // Explicitly setting format to JSON
        });
    }

    static async fetchExpenseSummary(month: number, year: number): Promise<ExpenseSummary[]> {
        return request<ExpenseSummary[]>({
            url: "expense-summary",
            params: { month, year },
        });
    }

    static async fetchCategorisedExpenseSummary(month: number, year: number): Promise<CategorisedExpenseSummary> {
        return request<CategorisedExpenseSummary>({
            url: "categorised-expense-summary",
            params: { month, year },
        });
    }
}

export default TransactionModel