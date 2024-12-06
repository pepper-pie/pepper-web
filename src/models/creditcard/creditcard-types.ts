import { PersonalAccount, Transaction } from "../transactions/transaction-types";

export interface CreditCard {
    id: number;
    bank_name: string;
    card_type: string;
    card_limit: number;
    billing_cycle_date: number;
    due_date_cycle: number;
    carry_emi_taxes: boolean;
    personal_account: PersonalAccount; // Nullable if no account is linked
}


export interface CreditCardSummary {
    opening_balance: number;
    credits_and_reversals: number;
    expense_amounts: number;
    total_tax: number;
    total_bill: number;
    emi_amounts: number;
    due_date: number;
    billing_cycle_start: number
    transactions: Transaction[]
}

export interface CreditCardTrend {
    month: string; // E.g., "November 2023"
    taxes: number; // Total taxes
    emis: number; // Total EMIs
    expenses: number; // Total expenses
    total_bill: number; // Total bill for the month
}