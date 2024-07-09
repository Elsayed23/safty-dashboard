import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {

        const { id } = params

        const user = await db.user.findFirst({
            where: {
                id
            },
            include: {
                job_title: true,
                role: true,
                supervisors: {
                    select: {
                        supervisor: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        })
        return NextResponse.json(user)





    } catch (error) {
        console.log("[user]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}
