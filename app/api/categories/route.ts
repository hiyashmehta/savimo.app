import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
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
export async function POST(req: Request) {
    // write the post request to create a category here
    const session = await getSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" });
    }
    try {
        const { name } = await req.json();
        const category = await prisma.category.create({
            data: {
                name,
                userId: session.user.id,
            },
        });
        return NextResponse.json({ result: category, status: "success" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" });
    }
}
export async function PUT(req: Request) {
    // write the put request to update a category here
    const session = await getSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" });
    }
    try {
        const { id, name } = await req.json();
        const category = await prisma.category.update({
            where: {
                id,
            },
            data: {
                name,
            },
        });
        return NextResponse.json({ result: category, status: "success" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" });
    }
}
export async function DELETE(req: Request) {
    // write the delete request to delete a category here
    const session = await getSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" });
    }
    try {
        const { id } = await req.json();
        await prisma.category.delete({
            where: {
                id,
            },
        });
        return NextResponse.json({ status: "success" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" });
    }
}
