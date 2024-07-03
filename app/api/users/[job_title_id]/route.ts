import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { job_title_id: string } }
) {
    try {

        const { job_title_id } = params

        if (job_title_id === '') {
            const user = await db.user.findMany({
                include: {
                    job_title: true,
                    violations: true
                }
            })
            return NextResponse.json(user)
        } else {
            const user = await db.user.findMany({
                where: {
                    job_titleId: job_title_id
                },
                include: {
                    job_title: true,
                    violations: true
                }
            })
            return NextResponse.json(user)
        }




    } catch (error) {
        console.log("[user]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}
