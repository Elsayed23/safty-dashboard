import { db } from '@/lib/db'
import { NextResponse } from 'next/server'


export async function PUT(
    req: Request,
    { params: { id } }: { params: { id: string } }
) {
    try {

        const { status, userId } = await req.json()

        const assessment = await db.riskAssessment.update({
            where: { id },
            data: {
                status,
                approverId: userId
            }
        })

        return NextResponse.json(assessment)
    } catch (error) {
        return NextResponse.json(
            { error: error },
            { status: 500 }
        )
    }
}