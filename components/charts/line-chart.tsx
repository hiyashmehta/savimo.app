import { LineChart } from "@tremor/react";
import { Transaction } from "../shared/tables/transaction-table";
import { format } from "date-fns";

const chartdata = [
	{
		date: "Jan 22",
		SemiAnalysis: 2890,
		"The Pragmatic Engineer": 2338,
	},
	{
		date: "Feb 22",
		SemiAnalysis: 2756,
		"The Pragmatic Engineer": 2103,
	},
	{
		date: "Mar 22",
		SemiAnalysis: 3322,
		"The Pragmatic Engineer": 2194,
	},
	{
		date: "Apr 22",
		SemiAnalysis: 3470,
		"The Pragmatic Engineer": 2108,
	},
	{
		date: "May 22",
		SemiAnalysis: 3475,
		"The Pragmatic Engineer": 1812,
	},
	{
		date: "Jun 22",
		SemiAnalysis: 3129,
		"The Pragmatic Engineer": 1726,
	},
	{
		date: "Jul 22",
		SemiAnalysis: 3490,
		"The Pragmatic Engineer": 1982,
	},
	{
		date: "Aug 22",
		SemiAnalysis: 2903,
		"The Pragmatic Engineer": 2012,
	},
	{
		date: "Sep 22",
		SemiAnalysis: 2643,
		"The Pragmatic Engineer": 2342,
	},
	{
		date: "Oct 22",
		SemiAnalysis: 2837,
		"The Pragmatic Engineer": 2473,
	},
	{
		date: "Nov 22",
		SemiAnalysis: 2954,
		"The Pragmatic Engineer": 3848,
	},
	{
		date: "Dec 22",
		SemiAnalysis: 3239,
		"The Pragmatic Engineer": 3736,
	},
];

const dataFormatter = (number: number) =>
	`${Intl.NumberFormat("en-in").format(number).toString()}`;

export function LineChartHero({ data }: { data: Transaction[] }) {
	// const
	// group by date and the sum of the amount, based on the type
	const chartdata = data.map((item) => {
		return {
			date: format(new Date(item.transactionDate), "MMM, dd, yyyy"),
			[item.type]: item.amount,
		};
	});
	//merge the data with same dates and sum the expenses with expenses and incomes with incomes
	const mergedData = chartdata.reduce(
		(acc, item) => {
			const date = item.date;
			const expense = Number(item.expense) || 0;
			const income = Number(item.income) || 0;
			const existing = acc.find((i) => i.date === date);
			if (existing) {
				existing.expense += expense;
				existing.income += income;
			} else {
				acc.push({ date, expense, income });
			}
			return acc;
		},
		[] as { date: string; expense: number; income: number }[],
	);
	return (
		<LineChart
			className="h-80"
			data={mergedData}
			index="date"
			categories={["income"]}
			colors={["indigo"]}
			valueFormatter={dataFormatter}
			yAxisWidth={60}
			onValueChange={(v) => console.log(v)}
		/>
	);
}
