import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {

        const instrumentId = await req.nextUrl.searchParams.get('instrumentId') as string

        const { id } = params

        const instrumentNumImage = await db.instrument.findUnique({
            where: {
                id: instrumentId
            },
            select: {
                numbersImage: true
            }
        })

        const typeOfTests = await db.typeOfTest.findFirst({
            where: {
                id
            },
            include: {
                testEntries: true,
            }
        })

        const resData = {
            ...typeOfTests,
            numbersImage: instrumentNumImage?.numbersImage

        }

        return NextResponse.json(resData)

    } catch (error) {
        console.log("[instruments]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}
