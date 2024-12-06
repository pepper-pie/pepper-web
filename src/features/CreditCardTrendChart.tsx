import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { CreditCardTrend } from "../models/creditcard/creditcard-types";

interface CreditCardTrendChartProps {
    data: CreditCardTrend[];
}

const CreditCardTrendChart: React.FC<CreditCardTrendChartProps> = ({ data }) => {
    const options = useMemo(() => {
        const months = data.map((item) => item.month);
        const taxes = data.map((item) => item.taxes);
        const emis = data.map((item) => item.emis);
        const expenses = data.map((item) => item.expenses);
        const totalBill = data.map((item) => item.total_bill);

        return {
            title: {
                text: "Credit Card Trend",
                left: "center",
            },
            tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
            },
            legend: {
                data: ["Taxes", "EMIs", "Expenses", "Total Bill"],
                bottom: "0",
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "15%",
                containLabel: true,
            },
            xAxis: {
                type: "category",
                data: months,
            },
            yAxis: {
                type: "value",
                axisLabel: {
                    formatter: "₹{value}",
                },
            },
            series: [
                {
                    name: "Taxes",
                    type: "bar",
                    stack: "total",
                    data: taxes,
                },
                {
                    name: "EMIs",
                    type: "bar",
                    stack: "total",
                    data: emis,
                },
                {
                    name: "Expenses",
                    type: "bar",
                    stack: "total",
                    data: expenses,
                },
                {
                    name: "Total Bill",
                    type: "line",
                    data: totalBill,
                    smooth: true,
                },
            ],
        };
    }, [data]);

    return <ReactECharts option={options} style={{ height: "500px", width: "100%" }} />;
};

export default CreditCardTrendChart;