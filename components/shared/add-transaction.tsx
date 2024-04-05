"use client";
import React, { useEffect } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

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
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTransaction, getTransactions } from "@/lib/actions/transactions";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { getPaymentMethods } from "@/lib/actions/payment-method";
const FormSchema = z.object({
	title: z.string().min(3, {
		message: "Payment method name must be at least 3 characters long",
	}),
	amount: z.number().positive({
		message: "Amount must be a positive number",
	}),
	paymentMethod: z.string().min(3, {
		message: "Payment method must be at least 3 characters long",
	}),
	date: z.date(),
	description: z.string().optional(),
	type: z.enum(["expense", "income"]),
});

export default function AddTransaction() {
	const [open, setOpen] = React.useState(false);
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: "",
			amount: 0,
			paymentMethod: "",
			date: new Date(),
			description: "",
			type: "expense",
		},
	});

	const user = useCurrentUser();
	const { data: paymentMethods, isLoading } = useQuery({
		queryKey: ["payment-methods"],
		queryFn: () =>
			getPaymentMethods() as Promise<{ id: string; name: string }[]>,
		enabled: !!user?.id,
	});
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: createTransaction,
		onSuccess: () => {
			toast.success("Payment method added successfully");
			form.reset();
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		mutate({ data });
	}
	if (isLoading) return <div>Loading...</div>;
	if (paymentMethods)
		return (
			<Dialog open={open} onOpenChange={() => setOpen(!open)}>
				<Button onClick={() => setOpen(true)}>Add Transaction</Button>
				<DialogContent>
					<h1 className="text-xl font-medium">
						Add Transaction
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
												className="w-auto p-0"
												align="start"
											>
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date: Date) =>
														date > new Date() ||
														date <
															new Date(
																"1900-01-01",
															)
													}
													initialFocus
												/>
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
								name="paymentMethod"
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
