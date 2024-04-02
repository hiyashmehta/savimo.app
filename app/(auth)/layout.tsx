"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

// export const metadata: Metadata = {
// 	title: "Login | Savimo.app",
// };

export default function AuthLayout({ children }: { children: ReactNode }) {
	const { data, status, update } = useSession();

	if (status === "authenticated") {
		redirect("/app");
	}
	if (status === "unauthenticated")
		return (
			<div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
				{children}
			</div>
		);
}
