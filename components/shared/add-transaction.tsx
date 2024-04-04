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

	const [paymentMethods, setPaymentMethods] = React.useState([]);
	const handleFetchPaymentMethods = () => {
		fetch("/api/payment-method")
			.then((res) => res.json())
			.then((json) => {
				console.log(json);
				if (json.status === "success") {
					setPaymentMethods(json.result);
				}
			})
			.catch((err) => console.log(err));
	};
	useEffect(() => {
		handleFetchPaymentMethods();
	}, [open]);
	function onSubmit(data: z.infer<typeof FormSchema>) {
		// toast({
		// 	title: "You submitted the following values:",
		// 	description: (
		// 		<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
		// 			<code className="text-white">
		// 				{JSON.stringify(data, null, 2)}
		// 			</code>
		// 		</pre>
		// 	),
		// });
		fetch("/api/transactions", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				toast.success("Payment method added successfully");
				form.reset();
			})
			.catch((err) => console.log(err));
	}
	return (
		<Dialog open={open} onOpenChange={() => setOpen(!open)}>
			<Button onClick={() => setOpen(true)}>Add Transaction</Button>
			<DialogContent>
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
										<Input placeholder="Title" {...field} />
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
													Number(event.target.value),
												)
											}

											// onChange={field.onChange}
											// {...field}
										/>
									</FormControl>
									<FormDescription>
										This is the amount of your transaction.
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
											defaultValue={field.value}
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
										This is the name of your payment method.
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
											placeholder="Payment Method"
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
									<FormLabel>Email</FormLabel>
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
										This is the type of your transaction.
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
