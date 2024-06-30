import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
    req: Request,
) {
    try {

        const { name, abbreviation, comments } = await req.json()

        const trainingDetail = await db.trainingDetail.create({
            data: {
                name,
                abbreviation,
                comments,
            }
        })

        return NextResponse.json(trainingDetail)

    } catch (error) {
        console.log("[trainingDetail]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function GET() {
    try {

        const trainingDetail = await db.trainingDetail.findMany()

        return NextResponse.json(trainingDetail)

    } catch (error) {
        console.log("[trainingDetail]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}