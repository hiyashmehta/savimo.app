import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req:Request){
    const session = await getSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" });
    }
    try {
        const charts = await prisma.chart.findMany({
            where: {
                userId: session.user.id,
            },
        });
        return NextResponse.json({ result: charts, status: "success" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" });
    }
}
export async function POST(req: Request){
    const session = await getSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" });
    }
    try {
        const { name, type, description } = await req.json();
        const chart = await prisma.chart.create({
            data: {
                name,
                userId: session.user.id,
                type,
                description,
            },
        });
        return NextResponse.json({ result: chart, status: "success" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" });
    }
}
export async function PUT(req: Request){
    const session = await getSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" });
    }
    try {
        const { id, name, type, description } = await req.json();
        const chart = await prisma.chart.update({
            where: {
                id,
            },
            data: {
                name,
                type,
                description,
            },
        });
        return NextResponse.json({ result: chart, status: "success" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" });
    }
}
export async function DELETE(req: Request){
    const session = await getSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" });
    }
    try {
        const { id } = await req.json();
        await prisma.chart.delete({
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