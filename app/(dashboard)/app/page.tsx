"use client";
import { AreaChartHero } from "@/components/charts/area-chart";
import { BarChartHero } from "@/components/charts/bar-chart";
import { BarListHero } from "@/components/charts/bar-list";
import { DonutChartUsageExample } from "@/components/charts/donut-chart";
import { LineChartHero } from "@/components/charts/line-chart";
import { SparkAreaUsageExample } from "@/components/charts/spark-chart";
import AddPaymentMethod from "@/components/shared/add-payment-method";
import AddTransaction from "@/components/shared/add-transaction";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

export default function AppPage() {
	const { data } = useSession();

	if (data)
		return (
			<div>
				AppPage
				<Button onClick={() => signOut()}>Sign out</Button>
				<h1>Welcome {data?.user?.name}</h1>
				<p>Your email is {data?.user?.email}</p>
				<Image
					src={data?.user?.image ?? "/profile.png"}
					alt="Profile picture"
					width={100}
					height={100}
					unoptimized
				/>
				<AddPaymentMethod />
				<AddTransaction />
				<AreaChartHero />
				<BarChartHero />
				<BarListHero />
				<DonutChartUsageExample />
				<LineChartHero />
				<SparkAreaUsageExample />
			</div>
		);
}
