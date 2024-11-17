import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Button, Typography } from "@mui/material";
import ExcelTable from "../components/ExcelTable";
import TransactionModel from "../models/transactions/transaction-model";
import { formatMoney } from "./TransactionTable";

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

    const columns = useMemo(
        () => [
            {
                Header: "Category",
                accessor: "category",
                Cell: ({ row, value }: any) => {
                    if (row.original.type === "category") {
                        return (
                            <Button onClick={() => toggleCategory(value)}>{value}</Button>
                        );
                    }
                    return value;
                },
            },
            {
                Header: "Sum of Credit Amount",
                accessor: "credit",
                Cell: ({ value }: any) => formatMoney(value),
            },
            {
                Header: "Sum of Debit Amount",
                accessor: "debit",
                Cell: ({ value }: any) => formatMoney(value),
            },
        ],
        []
    );

    if (isLoading) return <Typography>Loading...</Typography>;
    if (error) return <Typography>Error loading expense summary</Typography>;

    return (
        <Box>
            <ExcelTable columns={columns} data={renderRows()} />
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