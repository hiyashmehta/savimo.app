import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(req: Request) {
  // write the get request to get all categories here
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" });
  }
  try {
    const categories = await prisma.category.findMany({
      where: {
        userId: session.user.id,
      },
    });
    return NextResponse.json({ result: categories, status: "success" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
export async function POST() {}
export async function PUT() {}
export async function DELETE() {}
