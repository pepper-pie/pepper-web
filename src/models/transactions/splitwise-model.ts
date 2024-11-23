import { request } from "../../utils/axios-utils";
import { Friend, SplitwiseTransaction } from "./splitwise-types";

class SplitwiseModel {
    /**
     * Fetch transactions for a specific person within a date range.
     *
     * @param filters - Filters for person, start_date, and end_date.
     * @returns Promise<SplitwiseTransaction[]> - A promise that resolves to an array of splitwise transactions.
     */
    static async fetchTransactions(filters: {
        person?: string;
        start_date?: string;
        end_date?: string;
    }): Promise<SplitwiseTransaction[]> {
        return request<SplitwiseTransaction[]>({
            url: "splitwise/transactions",
            params: filters,
        });
    }

    static fetchFriends = async (): Promise<Friend[]> => {
        return request<Friend[]>({
            url: "splitwise/friends",
            method: "GET",
        });
    };
}

export default SplitwiseModel;