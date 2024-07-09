import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {

        const isSupervisor = req.nextUrl.searchParams.get('isSupervisor')
        const isSiteManager = req.nextUrl.searchParams.get('isSiteManager')

        if (isSupervisor) {
            const users = await db.user.findMany({
                where: {
                    job_titleId: 'df6c7dbc-3546-47e2-86df-e880a8c85a4c'
                },
                select: {
                    id: true,
                    name: true,
                    work_id: true
                }
            })

            return NextResponse.json(users)
        } if (isSiteManager) {
            const users = await db.user.findMany({
                select: {
                    id: true,
                    name: true
                }
            })

            return NextResponse.json(users)
        } else {
            const users = await db.user.findMany({
                include: {
                    job_title: true,
                    violations: true,
                    role: true,
                    supervisors: true
                }
            })

            return NextResponse.json(users)
        }



    } catch (error) {
        console.log("[users]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}