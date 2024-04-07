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

export default function UpdateTransactionDialog({ id }: { id: string }) {
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
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: "",
			amount: 0,
			paymentMethodId: "",
			// date: new Date(),
			description: "",
			type: "expense",
		},
		values: {
			title: transaction?.title as string,
			amount: transaction?.amount as number,
			paymentMethodId: transaction?.paymentMethodId as string,
			date: transaction?.date as Date,
			description: transaction?.description as string,
			type: transaction?.type as "expense" | "income",
		},
	});

	const { data: paymentMethods, isLoading } = useQuery({
		queryKey: ["payment-methods"],
		queryFn: () =>
			getPaymentMethods() as Promise<{ id: string; name: string }[]>,
		enabled: !!user?.id,
	});
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: updateTransaction,
		onSuccess: () => {
			toast.success("Payment method added successfully");
			form.resetField("title");
			form.resetField("amount");
			form.resetField("description");

			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		const item = {
			...data,
			id: transaction?.id as string,
		};
		mutate({ data: item });
	}
	if (isLoading) return <div>Loading...</div>;
	if (paymentMethods)
		return (
			<Dialog open={open} onOpenChange={() => setOpen(!open)}>
				<Button onClick={() => setOpen(true)}>
					Update Transaction
				</Button>
				<DialogContent>
					<h1 className="text-xl font-medium">
						Update Transaction
						{isPending && (
							<span className="text-muted-foreground">
								{" "}
								- Saving...
							</span>
						)}
					</h1>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="w-full space-y-6"
						>
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input
												placeholder="Title"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											This is the title of transaction
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="amount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Amount</FormLabel>
										<FormControl>
											<Input
												placeholder="0"
												type="number"
												value={Number(field.value)}
												onChange={(event) =>
													field.onChange(
														Number(
															event.target.value,
														),
													)
												}

												// onChange={field.onChange}
												// {...field}
											/>
										</FormControl>
										<FormDescription>
											This is the amount of your
											transaction.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="date"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Transaction Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-[240px] pl-3 text-left font-normal",
															!field.value &&
																"text-muted-foreground",
														)}
													>
														{field.value ? (
															format(
																field.value,
																"PPP",
															)
														) : (
															<span>
																Pick a date
															</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent
												className="flex w-auto flex-col space-y-2 p-2"
												align="start"
											>
												{/* <Input
													placeholder="DD/MM/YYYY"
													type="date"
													// value={field.value}
													onChange={field.onChange}

													// onChange={field.onChange}
													// {...field}
												/> */}
												<Select
													onValueChange={(value) =>
														field.onChange(
															addDays(
																new Date(),
																parseInt(value),
															),
														)
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select" />
													</SelectTrigger>
													<SelectContent position="popper">
														<SelectItem value="0">
															Today
														</SelectItem>
														<SelectItem value="1">
															Tomorrow
														</SelectItem>
														<SelectItem value="3">
															In 3 days
														</SelectItem>
														<SelectItem value="7">
															In a week
														</SelectItem>
													</SelectContent>
												</Select>{" "}
												<div className="rounded-md border">
													<Calendar
														mode="single"
														selected={field.value}
														onSelect={
															field.onChange
														}
														// numberOfMonths={3}
														defaultMonth={
															field.value
														}
														disabled={(
															date: Date,
														) =>
															date > new Date() ||
															date <
																new Date(
																	"1900-01-01",
																)
														}
														initialFocus
													/>
												</div>
											</PopoverContent>
										</Popover>
										<FormDescription>
											This is the date of the transaction.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="paymentMethodId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Payment Method</FormLabel>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												// defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select the payment method" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{paymentMethods.map(
														(item: any) => (
															<SelectItem
																value={item?.id}
																key={item?.id}
															>
																{item?.name}
															</SelectItem>
														),
													)}
												</SelectContent>
											</Select>
										</FormControl>
										<FormDescription>
											This is the name of your payment
											method.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Input
												placeholder="Description"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											This is the description of your
											transaction.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Transaction Type</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select the transaction type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="expense">
													Expense
												</SelectItem>
												<SelectItem value="income">
													Income
												</SelectItem>
											</SelectContent>
										</Select>
										<FormDescription>
											This is the type of your
											transaction.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit">Save</Button>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		);
}
