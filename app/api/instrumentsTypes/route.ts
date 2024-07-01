import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const types = await db.instrumentType.findMany({
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json(types)

    } catch (error) {
        console.log("[types]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function POST(req: Request) {
    try {

        const { name } = await req.json()

        const types = await db.instrumentType.create({
            data: {
                name
            }
        })

        return NextResponse.json(types)

    } catch (error) {
        console.log("[types]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}

