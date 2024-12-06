import React, { FC } from 'react'
import { Box } from '@mui/material';
import { Transaction } from '../../models/transactions/transaction-types';
import ExcelTable from '../../components/ExcelTable';
import { getTransactionColumns } from '../../features/TransactionTable';

export interface CreditCardTransactionsProps {
    transactions: Transaction[]
}

const CreditCardTransactions: FC<CreditCardTransactionsProps> = ({ transactions }) => {

    return (
        <Box height={'calc(100vh - 180px)'} >
            <ExcelTable columns={getTransactionColumns()} data={transactions} />
        </Box>
    )
}

export default CreditCardTransactions