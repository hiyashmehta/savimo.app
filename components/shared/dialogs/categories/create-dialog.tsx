"use client";
import React from "react";
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
const FormSchema = z.object({
  name: z.string().min(3, {
    message: "Category name must be at least 3 characters long",
  }),
});

export default function CreateCategoryDialog() {
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    fetch("/api/categories", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        toast.success("Category added successfully");
        form.reset();
      })
      .catch((err) => console.log(err));
  }
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <Button onClick={() => setOpen(true)} variant={"outline"}>
        Add Category
      </Button>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category, eg: Groceries, Daily Expense" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name of your category.
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
