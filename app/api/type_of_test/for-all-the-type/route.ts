import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, instrumentTypeId, testEntries } = await req.json()

        const typeOfTest = await db.typeOfTest.create({
            data: {
                name,
                instrumentTypeId,
                testEntries: {
                    create: testEntries
                }
            },
            include: {
                testEntries: true
            }
        })

        return NextResponse.json(typeOfTest)

    } catch (error) {
        console.log("[typeOfTest]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}