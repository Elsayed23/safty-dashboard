import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { user_id: string } }
) {
    try {

        const { user_id } = params

        const trainings = await db.training.findMany({
            where: {
                user_id
            },
            include: {
                training: true,

            }
        })

        return NextResponse.json(trainings)

    } catch (error) {
        console.log("[trainings]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}
