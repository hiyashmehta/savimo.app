import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" });
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id,
            },
            include: {
                categories: true,
                accounts: true,
            },
        });
        return NextResponse.json({ result: user, status: "success" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" });
    }
}

export async function PUT(req: Request) {
    const session = await getSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" });
    }
    try {
        const { id, name, email } = await req.json();
        const user = await prisma.user.update({
            where: {
                id,
            },
            data: {
                name,
                email,
            },
        });
        return NextResponse.json({ result: user, status: "success" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" });
    }
}

export async function DELETE(req: Request) {
    const session = await getSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" });
    }
    try {
        
        // delete all the user data and charts and transactions, and categories, payment methods, and accounts, sessions
        
        // create a prisma transaction to delete all the related info of the user
        const deleteUser = await prisma.$transaction([
            prisma.transaction.deleteMany({
                where: {
                    userId: session.user.id,
                },
            }),
            prisma.category.deleteMany({
                where: {
                    userId: session.user.id,
                },
            }),
            prisma.account.deleteMany({
                where: {
                    userId: session.user.id,
                },
            }),
            prisma.paymentMethod.deleteMany({
                where: {
                    userId: session.user.id,
                },
            }),
            prisma.chart.deleteMany({
                where: {
                    userId: session.user.id,
                },
            }),
            prisma.session.deleteMany({
                where: {
                    userId: session.user.id,
                },
            }),
            prisma.user.delete({
                where: {
                    id: session.user.id,
                },
            }),
        ]);

        return NextResponse.json({ message:"Your account is deleted successfully!", status: "success" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" });
    }
}