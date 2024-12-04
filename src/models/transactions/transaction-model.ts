import { AccountSummary } from "../../features/AccountSummaryTable";
import { CategorisedExpenseSummary } from "../../features/ExpensePivotTable";
import { ExpenseSummary } from "../../features/ExpenseSummaryTable";
import { request } from "../../utils/axios-utils";
import { downloadFile } from "../../utils/file-utils";
import { PersonalAccount, Transaction } from "./transaction-types";

class TransactionModel {


    static async fetchPersonalAccounts(): Promise<PersonalAccount[]> {
        // Use the request function for API call
        return request<PersonalAccount[]>({
            url: "personal-accounts/"
        });
    }


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
            url: "account-summary-report",
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

    static async downloadMonthlyReport(month: number, year: number) {

        // Fetch the file
        const response = await request<BlobPart, false>({
            url: "monthly-reports/",
            params: { month, year },
            responseType: 'blob', // Handle binary data
        }, false);

        // Get file name from response headers or set a default name
        const contentDisposition = response.headers['content-disposition'];
        const fileName = contentDisposition
            ? contentDisposition.split('filename=')[1]?.split(';')[0]?.replace(/"/g, '') // Remove quotes if present
            : `Monthly_Report_${month}_${year}.xlsx`;

        // Create a Blob from the response
        const blob = new Blob([response.data], { type: response.headers['content-type'] });

        downloadFile(blob, fileName)
    }

    static async uploadTransactions(file: File) {
        try {
            // Create a FormData object to send the file
            const formData = new FormData();
            formData.append('file', file);

            // Make the API call
            const response = await request<Blob | Record<string, string>, false>({
                url: 'upload-transactions/',
                method: 'post',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
                responseType: 'blob', // Set to blob to handle both JSON and Excel responses
            }, false);

            // Determine response type
            const contentType = response.headers['content-type'];

            if (contentType.includes('application/json')) {
                // Handle JSON response
                const reader = new FileReader();
                reader.onload = () => {
                    const jsonResponse = JSON.parse(reader.result as string);
                    alert(`Success: ${jsonResponse.message || 'File uploaded successfully!'}`);
                };
                reader.readAsText(response.data as Blob);
            } else if (contentType.includes('application/octet-stream')) {
                // Handle Excel response
                downloadFile(response.data as Blob, 'response.xlsx');
            } else {
                alert('Unexpected response type.');
            }
        } catch (error: any) {
            console.error('Error uploading file:', error);

            // Check if error response contains a file
            const contentType = error.response.headers['content-type'];

            if (contentType.includes('application/json')) {
                alert(String(error.response?.data));
                return
            }

            if (error.response?.data instanceof Blob) {

                if (contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
                    downloadFile(error.response.data, 'error_response.xlsx');
                }
            } else {
                // Fallback for non-file error responses
                alert(`Failed: ${error.message || 'Unknown error occurred.'}`);
            }
        }
    }

}

export default TransactionModel