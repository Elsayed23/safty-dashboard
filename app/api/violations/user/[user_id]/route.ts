import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { user_id: string } }
) {
    try {

        const { user_id } = params

        const violations = await db.violation.findMany({
            where: {
                user_id
            }
        })

        return NextResponse.json(violations)



    } catch (error) {
        console.log("[violation]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}
