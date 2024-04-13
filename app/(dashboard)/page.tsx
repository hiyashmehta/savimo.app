"use client";
import { AreaChartHero } from "@/components/charts/area-chart";
import { BarChartHero } from "@/components/charts/bar-chart";
import { LineChartHero } from "@/components/charts/line-chart";
import AddPaymentMethod from "@/components/shared/dialogs/payment-method/add-payment-method";
import AddTransaction from "@/components/shared/dialogs/transactions/add-transaction";
import {
    Transaction,
    TransactionTable,
} from "@/components/shared/tables/transaction-table";
import { Button } from "@/components/ui/button";
import { getTransactions } from "@/lib/actions/transactions";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { useQuery } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import Image from "next/image";
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
                <div className="flex justify-between p-4">
                    <h1>Welcome {user?.name}</h1>
                    <p>Your email is {user?.email}</p>
                    <Image
                        src={user?.image ?? "/profile.png"}
                        alt="Profile picture"
                        width={100}
                        height={100}
                        unoptimized
                        className="h-10 w-10 rounded-full"
                    />
                    <Button onClick={() => signOut()}>Sign out</Button>
                    <AddPaymentMethod />
                    <AddTransaction />
                </div>
                <div className="p-4">
                    <AreaChartHero data={filteredTransactions} />
                    <BarChartHero data={filteredTransactions} />
                    <LineChartHero data={filteredTransactions} />
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
