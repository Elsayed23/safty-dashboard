import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {

        const job_titles = await db.jobTitle.findMany()

        return NextResponse.json(job_titles)

    } catch (error) {
        console.log("[job_titles]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}