import React, { FC } from 'react'
import { Box } from '@mui/material';
import { CreditCardSummary, CreditCardTrend } from '../../models/creditcard/creditcard-types';
import InfoCard from '../../components/InfoCard';
import { formatMoney } from '../../utils/string-utils';
import CreditCardTrendChart from '../../features/CreditCardTrendChart';
import CategoryCharts from '../../features/CategoriesChart';

export interface CreditCardSummaryScreenProps {
    cardSummary: CreditCardSummary;
    ccTrend: CreditCardTrend[]
}

const CreditCardSummaryScreen: FC<CreditCardSummaryScreenProps> = ({ cardSummary, ccTrend }) => {
    return (
        <Box display={'flex'} >
            <Box>
                <Box display={'flex'} mb={5} >
                    {
                        [
                            {
                                'title': cardSummary.opening_balance * -1,
                                'subtitle': 'Opening Balance',
                            },
                            {
                                'title': cardSummary.credits_and_reversals,
                                'subtitle': 'Credits and Reversal',
                            },
                            {
                                'title': cardSummary.emi_amounts + cardSummary.total_tax + cardSummary.expense_amounts,
                                'subtitle': 'Total Expense',
                            },
                            {
                                'title': cardSummary.total_bill,
                                'subtitle': 'Total Due',
                            }
                        ].map(d => {
                            return <Box marginRight={1} key={d.subtitle} >
                                <InfoCard label={d.subtitle} value={formatMoney((d.title))} />
                            </Box>
                        })
                    }
                </Box>
                <CreditCardTrendChart data={ccTrend || []} />
            </Box>
            <Box flex={1} >
                <CategoryCharts transactions={cardSummary?.transactions || []} />
            </Box>
        </Box>
    )
}

export default CreditCardSummaryScreen