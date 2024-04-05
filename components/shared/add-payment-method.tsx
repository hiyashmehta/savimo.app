"use client";
import React from "react";
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
const FormSchema = z.object({
	paymentMethodName: z.string().min(3, {
		message: "Payment method name must be at least 3 characters long",
	}),
});

export default function AddPaymentMethod() {
	const [open, setOpen] = React.useState(false);
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			paymentMethodName: "",
		},
	});

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
		fetch("/api/payment-method", {
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
			<Button onClick={() => setOpen(true)} variant={'outline'}>Add Payment Method</Button>
			<DialogContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-2/3 space-y-6"
					>
						<FormField
							control={form.control}
							name="paymentMethodName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Payment Method</FormLabel>
									<FormControl>
										<Input
											placeholder="Payment Method"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										This is the name of your payment method.
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
