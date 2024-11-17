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
}

export default TransactionModel