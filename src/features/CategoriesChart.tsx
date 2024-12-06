import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { Transaction } from "../models/transactions/transaction-types";
import { EChartsOption, PieSeriesOption } from "echarts";

export interface ChartData {
    name: string;
    value: number;
}

export interface ChartGroup {
    category: string;
    subCategories: ChartData[];
}

interface CategoryChartsProps {
    transactions: Transaction[];
}

const CategoryCharts: React.FC<CategoryChartsProps> = ({ transactions }) => {
    // Aggregate data for categories
    const categoryData: PieSeriesOption['data'] = useMemo(() => {
        const categoryMap: Record<string, number> = {};

        transactions.forEach(({ category, debit_amount }) => {
            if (category) {
                categoryMap[category] = (categoryMap[category] || 0) + debit_amount;
            }
        });

        return Object.entries(categoryMap).map(([name, value]) => ({
            name,
            value,
        }));
    }, [transactions]);

    // Aggregate data for subcategories
    const subCategoryData = useMemo(() => {
        const subCategoryMap: Record<string, number> = {};

        transactions.forEach(({ sub_category, debit_amount }) => {
            if (sub_category) {
                subCategoryMap[sub_category] = (subCategoryMap[sub_category] || 0) + debit_amount;
            }
        });

        return Object.entries(subCategoryMap).map(([name, value]) => ({
            name,
            value,

        }));
    }, [transactions]);

    // Options for category pie chart
    const categoryOptions: EChartsOption = {
        title: {
            text: "Category-wise Expenses",
            left: "center",
        },
        tooltip: {
            trigger: "item",
            formatter: "{b}: ₹{c} ({d}%)",
        },
        legend: {
            orient: "vertical",
            left: "left",
            top: 50,
        },
        series: [
            {
                name: "Categories",
                type: "pie",
                radius: "50%",
                top: 100,
                data: categoryData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)",
                    },
                },
            },
        ],

    };

    // Options for sub-category pie chart
    const subCategoryOptions = {
        title: {
            text: "Subcategory-wise Expenses",
            left: "center",
        },
        tooltip: {
            trigger: "item",
            formatter: "{b}: ₹{c} ({d}%)",
        },
        legend: {
            orient: "vertical",
            left: "left",
        },
        series: [
            {
                name: "Subcategories",
                type: "pie",
                radius: "50%",
                data: subCategoryData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)",
                    },
                },
            },
        ],
    };

    return (
        <div style={{ display: "flex", flexDirection: 'column' }}>
            <ReactECharts
                option={categoryOptions}
                style={{ width: "100%", height: "500px" }}
            />
            {/* <ReactECharts
                option={subCategoryOptions}
                style={{ width: "100%", height: "400px" }}
            /> */}
        </div>
    );
};

export default CategoryCharts;