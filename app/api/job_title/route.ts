import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {

        const jobTitles = await db.jobTitle.findMany()

        return NextResponse.json(jobTitles)

    } catch (error) {
        console.log("[job_titles]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export const POST = async (req: Request) => {
    try {

        const { title } = await req.json()

        await db.jobTitle.create({
            data: {
                title
            }
        })

        const getJobTitles = await db.jobTitle.findMany()


        return NextResponse.json(getJobTitles)


    } catch (error) {
        console.log("[job_titles]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export const DELETE = async (req: Request) => {
    try {

        const { id } = await req.json()


        await db.jobTitle.delete({
            where: {
                id
            }
        })


        const getJobTitles = await db.jobTitle.findMany()


        return NextResponse.json(getJobTitles)

    } catch (error) {
        console.log("[job_titles]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}