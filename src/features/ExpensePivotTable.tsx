import React, { useMemo, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useQuery } from "@tanstack/react-query";
import { Box, css, styled, Typography } from "@mui/material";
import ExcelTable from "../components/ExcelTable";
import TransactionModel from "../models/transactions/transaction-model";
import { formatMoney } from "../utils/string-utils";
import { Column } from "react-table";
import { round } from "lodash";

const ExpensePivotTable: React.FC<{ month: number; year: number }> = ({ month, year }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["expensePivotSummary", month, year],
        queryFn: () => TransactionModel.fetchCategorisedExpenseSummary(month, year),
        enabled: !!month && !!year,
        staleTime: 5 * 60 * 1000,
    });

    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    const toggleCategory = (category: string) => {
        setExpandedCategories((prev) =>
            prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
        );
    };

    const renderRows = () => {
        if (!data) return [];

        const rows: any[] = [];
        Object.keys(data.data).forEach((category) => {
            const categoryData = data.data[category];
            rows.push({
                type: "category",
                category,
                debit: categoryData.debit,
                credit: categoryData.credit,
            });

            if (expandedCategories.includes(category)) {
                categoryData.sub_categories.forEach((sub) => {
                    rows.push({
                        type: "sub_category",
                        category: sub.sub_category,
                        debit: sub.debit,
                        credit: sub.credit,
                    });
                });
            }
        });

        rows.push({
            type: "total",
            category: "Grand Total",
            debit: data.grand_total.debit,
            credit: data.grand_total.credit,
        });

        return rows;
    };

    const columns: Column<{ type: string; category: string; debit: number; credit: number }>[] = useMemo(
        () => [
            {
                Header: "Category",
                accessor: "category",
                Cell: ({ row, value }) => {
                    if (row.original.type === "category") {
                        const Icon = expandedCategories.includes(value) ? RemoveIcon : AddIcon
                        return (
                            <div
                                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                onClick={() => toggleCategory(value)}
                            >
                                <Icon style={{ marginRight: 4 }} fontSize="small" />
                                {value}
                            </div>
                        );
                    }
                    else if (row.original.type === "total") {
                        return (
                            <TotalRowCell>{value}</TotalRowCell>
                        )
                    }
                    return <span style={{ marginLeft: 30 }} >{value}</span>;
                },
            },
            {
                Header: "Sum of Credit Amount",
                accessor: "credit",
                Cell: ({ value, row }) => {
                    if (row.original.type === "total") return <TotalAmountCell>{formatMoney(value)}</TotalAmountCell>
                    if (row.original.type === "sub_category") return <SubAmountCell>{formatMoney(value)}</SubAmountCell>
                    return <AmountCell>{formatMoney(value)}</AmountCell>
                },
            },
            {
                Header: "Sum of Debit Amount",
                accessor: "debit",
                Cell: ({ value, row }) => {
                    if (row.original.type === "total") return <TotalAmountCell>{formatMoney(value)}</TotalAmountCell>
                    if (row.original.type === "sub_category") return <SubAmountCell>{formatMoney(value)}</SubAmountCell>
                    return <AmountCell>{formatMoney(value)}</AmountCell>
                },
            },
            {
                Header: "Totals",
                accessor: "type",
                Cell: ({ row }) => {
                    const value = round(row.original.debit - row.original.credit, 2);
                    if (row.original.type === "total") return <TotalAmountCell>{formatMoney(value)}</TotalAmountCell>
                    if (row.original.type === "sub_category") return <SubAmountCell>{formatMoney(value)}</SubAmountCell>
                    return <AmountCell>{formatMoney(value)}</AmountCell>
                },
            },
        ],
        [expandedCategories.length]
    );

    if (isLoading) return <Typography>Loading...</Typography>;
    if (error) return <Typography>Error loading expense summary</Typography>;

    return (
        <Box>
            <ExcelTable isRowHighlighted={d => d.type === 'total'} highlightColor={'#7AB2D3'} columns={columns} data={renderRows()} />
        </Box>
    );
};

export default ExpensePivotTable;


export interface SubCategory {
    sub_category: string; // Name of the subcategory
    debit: number;        // Total debit amount for the subcategory
    credit: number;       // Total credit amount for the subcategory
}

export interface ExpenseCategory {
    debit: number;                // Total debit for the category
    credit: number;               // Total credit for the category
    sub_categories: SubCategory[]; // List of subcategories for this category
}

export interface CategorisedExpenseSummary {
    data: Record<string, ExpenseCategory>; // Key-value pairs of category names and their data
    grand_total: {
        debit: number; // Grand total of debit
        credit: number; // Grand total of credit
    };
}

const totalRowCss = css`
    font-weight: 700;
    font-size: 14px;
`

const TotalRowCell = styled('span')({ ...totalRowCss })

const TotalAmountCell = styled('span')`
    ${totalRowCss}
    text-align: right;
`

const AmountCell = styled('span')({
    textAlign: 'right',
    fontWeight: 600
})

const SubAmountCell = styled('span')({
    textAlign: 'right'
})