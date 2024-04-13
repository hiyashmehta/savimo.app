import { BarChart } from "@tremor/react";
import { Transaction } from "../shared/tables/transaction-table";
import { format } from "date-fns";

const chartdata = [
	{
		name: "Amphibians",
		"Number of threatened species": 2488,
	},
	{
		name: "Birds",
		"Number of threatened species": 1445,
	},
	{
		name: "Crustaceans",
		"Number of threatened species": 743,
	},
	{
		name: "Ferns",
		"Number of threatened species": 281,
	},
	{
		name: "Arachnids",
		"Number of threatened species": 251,
	},
	{
		name: "Corals",
		"Number of threatened species": 232,
	},
	{
		name: "Algae",
		"Number of threatened species": 98,
	},
];

const dataFormatter = (number: number) =>
	Intl.NumberFormat("en-in").format(number).toString();

export const BarChartHero = ({ data }: { data: Transaction[] }) => {
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
	console.log({ chartdata, mergedData });

	return (
		<BarChart
			data={mergedData}
			index="date"
			categories={["expense"]}
			colors={["blue"]}
			valueFormatter={dataFormatter}
			yAxisWidth={48}
			onValueChange={(v) => console.log(v)}
		/>
	);
};
