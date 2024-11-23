// Define the transaction type
export interface SplitwiseTransaction {
    date: string;
    narration: string;
    debit: number;
    credit: number;
    person_name: string;
    running_balance: number;
}

export interface Friend {
    id: number;
    name: string;
    email: string;
    picture: string;
}