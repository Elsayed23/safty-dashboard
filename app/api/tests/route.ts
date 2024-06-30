import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
    try {
        const { instrumentId, typeOfTestId, typeOfTestName, testEntriesChecks } = await req.json()

        const test = await db.test.create({
            data: {
                instrumentId,
                typeOfTestId,
                typeOfTestName,
                testEntriesChecks: {
                    create: testEntriesChecks
                }
            },
            include: {
                testEntriesChecks: true
            }
        })

        return NextResponse.json(test)

    } catch (error) {
        console.log("[test]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}


export async function GET(req: NextRequest) {
    try {
        const instrumentId = req.nextUrl.searchParams.get('instrumentId')

        const test = await db.test.findMany({
            where: {
                instrumentId: instrumentId as string,
            },
            include: {
                testEntriesChecks: true,
                typeOfTest: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return NextResponse.json(test)

    } catch (error) {
        console.log("[test]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}