"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { data, status, update } = useSession();

	if (status === "unauthenticated") {
		redirect("/login");
	}
	if (status === "authenticated" && data.user) return <div>{children}</div>;
}
