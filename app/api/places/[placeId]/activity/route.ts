import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params: { placeId } }: { params: { placeId: string } }
) {
    try {
        const placeActivities = await db.activity.findMany({
            where: {
                placeId,
            },
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json(placeActivities)

    } catch (error) {
        console.log("[types]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function POST(
    req: Request,
    { params: { placeId } }: { params: { placeId: string } }
) {
    try {

        const { name } = await req.json()

        const activity = await db.activity.create({
            data: {
                placeId,
                name
            }
        })

        return NextResponse.json(activity)

    } catch (error) {
        console.log("[types]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}

