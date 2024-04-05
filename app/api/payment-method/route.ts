import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// write the api route here

export async function GET(req: Request) {
	const session = await getSession();
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" });
	}

	try {
		// get all payment methods for the user
		const method = await prisma.paymentMethod.findMany({
			where: {
				userId: session.user.id,
			},
		});
		return NextResponse.json({ result: method, status: "success" });
	} catch (error) {
		return NextResponse.json({ error: "Internal Server Error" });
	}
}
// write the post request to create a payment method here

export async function POST(req: Request) {
	const session = await getSession();
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" });
	}
	try {
		const { paymentMethodName } = await req.json();
		// create a payment method here
		const method = await prisma.paymentMethod.create({
			data: {
				name: paymentMethodName,
				userId: session.user.id,
			},
		});
		return NextResponse.json({ paymentMethodName, method });
	} catch (error) {
		return NextResponse.json({ error: "Internal Server Error" });
	}
}
export async function PUT(req: Request) {
	// write the put request to update a payment method here
	const session = await getSession();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" });
	}
	try {
		const { paymentMethodId, paymentMethodName } = await req.json();
		// create a payment method here
		const method = await prisma.paymentMethod.update({
			where: {
				id: paymentMethodId,
			},
			data: {
				name: paymentMethodName,
			},
		});
		return NextResponse.json({ result: method, status: "success" });
	} catch (error) {
		return NextResponse.json({ error: "Internal Server Error" });
	}
}
export async function DELETE(req: Request) {
	const session = await getSession();
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" });
	}
	try {
		const { paymentMethodId } = await req.json();
		// create a payment method here
		const method = await prisma.paymentMethod.delete({
			where: {
				id: paymentMethodId,
			},
		});
		return NextResponse.json({ result: method, status: "success" });
	} catch (error) {
		return NextResponse.json({ error: "Internal Server Error" });
	}
}
