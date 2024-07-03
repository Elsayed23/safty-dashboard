import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {

        const users = await db.user.findMany({
            include: {
                job_title: true,
                violations: true,
                role: true
            }
        })

        return NextResponse.json(users)

    } catch (error) {
        console.log("[users]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}