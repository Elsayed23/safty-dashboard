import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const places = await db.place.findMany({
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json(places)

    } catch (error) {
        console.log("[places]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function POST(req: Request) {
    try {

        const { name } = await req.json()

        const place = await db.place.create({
            data: {
                name
            }
        })

        return NextResponse.json(place)

    } catch (error) {
        console.log("[place]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}

