import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const subcontractors = await db.subcontractor.findMany({
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json(subcontractors)

    } catch (error) {
        console.log("[subcontractors]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function POST(req: Request) {
    try {

        const { name } = await req.json()

        const subcontractor = await db.subcontractor.create({
            data: {
                name,
            }
        })

        return NextResponse.json(subcontractor)

    } catch (error) {
        console.log("[place]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}

