import { AreaChart } from "@tremor/react";
import { Transaction } from "../shared/tables/transaction-table";
import { format } from "date-fns";

const dataFormatter = (number: number) =>
	`${Intl.NumberFormat("en-in").format(number).toString()}`;

export function AreaChartHero({ data }: { data: Transaction[] }) {
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
		<AreaChart
			className="h-80"
			data={mergedData}
			index="date"
			categories={["expense", "income"]}
			colors={["indigo", "rose"]}
			valueFormatter={dataFormatter}
			yAxisWidth={60}
			onValueChange={(v) => console.log(v)}
		/>
	);
}
