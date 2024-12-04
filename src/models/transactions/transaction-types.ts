export interface Transaction {
    id: number;
    date: string; // Format: YYYY-MM-DD
    narration: string; // Description of the transaction
    debit_amount: number; // Debit amount
    credit_amount: number; // Credit amount
    category: string | null; // Transaction category (e.g., "Salary"), can be null
    sub_category: string | null; // Sub-category (e.g., "Groceries"), can be null
    personal_account: string; // Name of the personal account (e.g., "HDFC Bank")
    nominal_account: string; // Name of the nominal account (e.g., "Income", "Expense")
    running_balance: number; // Running balance of the account
}

export interface PersonalAccount {
    id: number; // Unique identifier for the account
    name: string; // Name of the personal account
}