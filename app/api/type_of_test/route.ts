import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { NextApiRequest } from 'next'

export async function POST(req: Request) {
    try {
        const { name, instrumentId, instrumentTypeId, testEntries } = await req.json()

        const typeOfTest = await db.typeOfTest.create({
            data: {
                name,
                instrumentId,
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

export async function GET(req: NextRequest) {
    try {

        const instrumentId = req.nextUrl.searchParams.get('instrumentId')
        const instrumentTypeId = req.nextUrl.searchParams.get('instrumentTypeId')

        const typeOfTests = await db.typeOfTest.findMany({
            where: {
                instrumentId,
            },
            include: {
                testEntries: true,
                Test: true
            }
        })

        const globalTypeOfTest = await db.typeOfTest.findMany({
            where: {
                instrumentTypeId: instrumentTypeId
            },
            include: {
                testEntries: true,
                Test: true
            }
        })


        // Combine both arrays
        const combinedResults = [...typeOfTests, ...globalTypeOfTest];

        return NextResponse.json(combinedResults);



    } catch (error) {
        console.log("[typeOfTest]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}
