"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import {
	useQuery,
	useMutation,
	useQueryClient,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
const queryClient = new QueryClient();
export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<QueryClientProvider client={queryClient}>
				<Toaster className="dark:hidden" />
				<Toaster theme="dark" className="hidden dark:block" />
				{children}
			</QueryClientProvider>
		</SessionProvider>
	);
}
