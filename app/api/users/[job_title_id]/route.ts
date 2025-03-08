import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { job_title_id: string } }
) {
    try {

        const { job_title_id } = params
        const belogstoId = req.nextUrl.searchParams.get('belogsto')


        if (job_title_id === 'all') {
            const user = await db.user.findMany({
                where: {
                    subcontractorId: belogstoId
                },
                include: {
                    job_title: true,
                    violations: true,
                    trainings: {
                        select: {
                            training: {
                                select: {
                                    id: true,
                                    name: true,
                                    abbreviation: true
                                }
                            }
                        }
                    }
                }
            })
            return NextResponse.json(user)
        } else {
            const user = await db.user.findMany({
                where: {
                    job_titleId: job_title_id,
                    subcontractorId: belogstoId
                },
                include: {
                    job_title: true,
                    violations: true,
                    trainings: {
                        select: {
                            training: {
                                select: {
                                    id: true,
                                    name: true,
                                    abbreviation: true
                                }
                            }
                        }
                    }
                }
            })
            return NextResponse.json(user)
        }




    } catch (error) {
        console.log("[user]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}
