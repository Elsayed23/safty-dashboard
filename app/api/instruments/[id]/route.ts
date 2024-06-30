import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {

        const { id } = params

        const instruments = await db.instrument.findFirst({
            where: {
                id
            },
            include: {
                type: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return NextResponse.json(instruments)

    } catch (error) {
        console.log("[instruments]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}
