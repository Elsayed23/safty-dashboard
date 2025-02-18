import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params: { placeId, activityId } }: { params: { placeId: string, activityId: string } }
) {
    try {
        const types = await db.activity.findUnique({
            where: {
                id: activityId,
                placeId,
            },
            include: {
                riskAssessments: {
                    include: {
                        approver: {
                            select: {
                                name: true
                            }
                        },
                        uploader: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json(types)

    } catch (error) {
        console.log("[types]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}