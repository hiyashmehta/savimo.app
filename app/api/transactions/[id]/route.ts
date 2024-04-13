import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" });
  }

  const id = params.id;
  try {
    // return the transaction with the given id
    const transaction = await prisma.transaction.findUnique({
      where: {
        id,
      },
    });
    if (!transaction) {
      return NextResponse.json({
        status: "failure",
        result: "Transaction not found",
      });
    }
    return NextResponse.json({
      status: "success",
      result: transaction,
    });
  } catch (error) {
    return NextResponse.json({
      status: "failure",
      error,
    });
  }
}
export async function POST() {}
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" });
  }

  const id = params.id;
  const body = await req.json();
  try {
    // update the transaction with the given id
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id,
      },
      data: body,
    });
    return NextResponse.json({
      status: "success",
      result: updatedTransaction,
    });
  } catch (error) {
    return NextResponse.json({
      status: "failure",
      error,
    });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" });
  }
  const id = params.id;

  try {
    // delete the transaction with the given id
    const deletedTransaction = await prisma.transaction.delete({
      where: {
        id,
      },
    });
    return NextResponse.json({
      status: "success",
      result: deletedTransaction,
    });
  } catch (error) {
    return NextResponse.json({
      status: "failure",
      error,
    });
  }
}
