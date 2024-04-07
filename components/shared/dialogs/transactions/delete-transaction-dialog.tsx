"use client";
import React, { useEffect } from "react";
import { Dialog, DialogContent } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../../../ui/form";
import { Input } from "../../../ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../../../ui/calendar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createTransaction,
	deleteTransaction,
	getTransactions,
	updateTransaction,
} from "@/lib/actions/transactions";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { getPaymentMethods } from "@/lib/actions/payment-method";
import { Transaction } from "../../tables/transaction-table";
const FormSchema = z.object({
	title: z.string().min(3, {
		message: "Payment method name must be at least 3 characters long",
	}),
	amount: z.number().positive({
		message: "Amount must be a positive number",
	}),
	paymentMethodId: z.string().min(3, {
		message: "Payment method must be at least 3 characters long",
	}),
	date: z.date(),
	description: z.string().optional(),
	type: z.enum(["expense", "income"]),
});

export default function DeleteTransactionDialog({ id }: { id: string }) {
	const [open, setOpen] = React.useState(false);
	const user = useCurrentUser();

	const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
		queryKey: ["transactions"],
		queryFn: () => getTransactions() as Promise<Transaction[]>,
		enabled: !!user?.id,
	});

	const transaction = transactions?.find(
		(transaction) => transaction.id === id,
	);

	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: deleteTransaction,
		onSuccess: () => {
			toast.success("Transaction deleted successfully!");

			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});

	function handleDeleteTransaction({ id }: { id: string }) {
		mutate({ data: { id } });
	}
	if (isLoadingTransactions) return <div>Loading...</div>;
	if (transaction)
		return (
			<Dialog open={open} onOpenChange={() => setOpen(!open)}>
				<Button onClick={() => setOpen(true)} variant={"destructive"}>
					Delete Transaction
				</Button>
				<DialogContent>
					<h1 className="text-xl font-medium">
						Delete Transaction
						{isPending && (
							<span className="text-muted-foreground">
								{" "}
								- Saving...
							</span>
						)}
					</h1>
					<div>Are you sure you want to delete this transaction?</div>
					<div>
						<Button onClick={() => setOpen(false)}>Cancel</Button>
						<Button
							onClick={() =>
								handleDeleteTransaction({ id: transaction.id })
							}
							variant={"destructive"}
						>
							Delete
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		);
}
