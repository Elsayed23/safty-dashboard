import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {

        const { id } = params

        const violation = await db.violation.findFirst({
            where: {
                id
            },
            include: {
                approvals: {
                    select: {
                        user: {
                            select: {
                                name: true,
                                id: true
                            }
                        }
                    }
                },
                images: true,
                user: {
                    select: {
                        name: true,
                        job_title: {
                            select: {
                                title: true
                            }
                        },
                        role: true,
                        user_photo: true
                    }
                }
            }
        })

        return NextResponse.json(violation)



    } catch (error) {
        console.log("[violation]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}
