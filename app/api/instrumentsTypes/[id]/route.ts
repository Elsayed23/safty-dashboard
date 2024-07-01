import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {

        const { id } = params

        const instruments = await db.instrument.findMany({
            where: {
                typeId: id
            },
            include: {
                type: true
            }
        })

        return NextResponse.json(instruments)

    } catch (error) {
        console.log("[instruments]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}
