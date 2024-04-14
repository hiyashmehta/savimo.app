"use client";
import { AreaChartHero } from "@/components/charts/area-chart";
import { BarChartHero } from "@/components/charts/bar-chart";
import { LineChartHero } from "@/components/charts/line-chart";
import Navbar from "@/components/shared/navbar";
import {
    Transaction,
    TransactionTable,
} from "@/components/shared/tables/transaction-table";
import { getTransactions } from "@/lib/actions/transactions";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function AppPage() {
    const user = useCurrentUser();
    const {
        data: transactions,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["transactions"],
        queryFn: () => getTransactions() as Promise<Transaction[]>,
        enabled: !!user?.email,
    });
    const [filteredTransactions, setFilteredTransactions] = React.useState<
        Transaction[]
    >([]);
    React.useEffect(() => {
        if (transactions) {
            setFilteredTransactions(transactions);
            filterTransactions();
        }
    }, [transactions]);

    const filterTransactions = () => {
        // filter transactions here

        // select the time period to filter

        const filtered =
            transactions &&
            transactions.filter((transaction) => {
                // filter the transactions here
                if (transaction.amount < 1000) return transaction;
            });
        setFilteredTransactions(filtered as Transaction[]);
    };

    console.log({ transactions });
    if (isLoading) return <div>Loading...</div>;
    if (transactions)
        return (
            <div>
                <Navbar />
                <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <AreaChartHero data={filteredTransactions} />
                        <BarChartHero
                            data={filteredTransactions.slice(0, 20)}
                        />
                        <LineChartHero data={filteredTransactions} />
                        <LineChartHero
                            data={filteredTransactions.slice(0, 60)}
                        />
                    </div>
                    <TransactionTable data={transactions} />
                </div>
                {/* <AreaChartHero />
				<BarChartHero />
				<BarListHero />
				<DonutChartUsageExample />
				<LineChartHero />
				<SparkAreaUsageExample /> */}
            </div>
        );
}
