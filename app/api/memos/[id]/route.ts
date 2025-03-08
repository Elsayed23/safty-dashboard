import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (
    req: Request,
    { params: { id } }: { params: { id: string } }
) => {
    try {

        const memo = await db.memo.findUnique({
            where: {
                id
            },
            include: { user: true },
        })

        return NextResponse.json(memo)

    } catch (error) {
        console.log(error);
    }
}
