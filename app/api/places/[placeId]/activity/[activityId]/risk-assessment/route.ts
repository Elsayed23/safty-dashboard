import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import path from 'path'
import { writeFile } from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'

export async function POST(
    req: Request,
    { params: { placeId, activityId } }: { params: { placeId: string, activityId: string } }
) {
    try {
        // Get authentication information

        // Parse form data
        const formData = await req.formData()
        const file = formData.get('file') as File
        const userId = formData.get('userId') as string

        // Validate input
        if (!file || !activityId || !placeId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Only Word documents (.doc, .docx) are allowed' },
                { status: 400 }
            )
        }

        // Create uploads directory if not exists
        const uploadDir = path.join(process.cwd(), 'public/uploads')
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true })
        }

        // Save file
        const fileName = `${Date.now()}-${file.name}`
        const filePath = path.join(uploadDir, fileName)
        const buffer: any = Buffer.from(await file.arrayBuffer())
        await writeFile(filePath, buffer)

        // Create database record
        const assessment = await db.riskAssessment.create({
            data: {
                activityId,
                fileName: file.name,
                filePath: `/uploads/${fileName}`,
                uploaderId: userId,
                status: 'PENDING'
            }
        })

        return NextResponse.json(assessment)

    } catch (error) {
        console.error('[RISK_ASSESSMENT_POST]', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const activityId = searchParams.get('activityId')

        if (!activityId) {
            return NextResponse.json({ error: 'activityId is required' }, { status: 400 })
        }

        const assessments = await db.riskAssessment.findMany({
            where: { activityId },
            include: {
                uploader: { select: { name: true } },
                approver: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(assessments)

    } catch (error) {
        console.error('[RISK_ASSESSMENT_GET]', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
