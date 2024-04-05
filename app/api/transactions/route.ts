import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
	const session = await getSession();
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" });
	}

	try {
		// get the list of transactions and return it, also, update the paymentMethodName for each transaction by joining the paymentMethod table
		// using the paymentMethodId
		const list = await prisma.transaction.findMany({
			where: {
				userId: session.user.id,
			},
			include: {
				paymentMethod: true,
			},
			orderBy: {
				transactionDate: "asc",
			},
		});
		return NextResponse.json({ result: list, status: "success" });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Internal Server Error" });
	}
}
export async function POST(req: Request) {
	const session = await getSession();
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" });
	}
	try {
		const { amount, date, description, paymentMethod, title, type } =
			await req.json();
		// create a payment method here
		const result = await prisma.transaction.create({
			data: {
				userId: session.user.id,
				amount,
				currency: "INR",
				description,
				title,
				type,
				paymentMethodId: paymentMethod,
				transactionDate: date,
			},
		});
		return NextResponse.json({ result: result, status: "success" });
	} catch (error) {
		console.error(error);

		return NextResponse.json({
			error: "Internal Server Error",
			details: error,
		});
	}
}
export function PUT() {}
export function DELETE() {}
export function PATCH() {}
