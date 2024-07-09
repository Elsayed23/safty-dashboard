import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { job_title_id: string } }
) {
    try {

        const { job_title_id } = params
        console.log(job_title_id);


        if (job_title_id === 'all') {
            const user = await db.user.findMany({
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
                    job_titleId: job_title_id
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
