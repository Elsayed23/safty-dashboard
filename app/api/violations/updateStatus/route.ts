import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        const { violation_id, status, user_id } = await req.json();

        if (!violation_id || !status || !user_id) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // Update the status of the violation
        const updatedViolation = await db.violation.update({
            where: { id: violation_id },
            data: { status },
            include: {
                approvals: {
                    select: {
                        user: {
                            select: {
                                name: true
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
        });

        // Check if the user has already made an approval for this violation
        const existingApproval = await db.userViolationApproval.findFirst({
            where: {
                user_id,
                violation_id,
            },
        });

        let newApproval;
        if (!existingApproval) {
            // Add a new approval entry if none exists
            newApproval = await db.userViolationApproval.create({
                data: {
                    user_id,
                    violation_id,
                },
            });
        }

        return NextResponse.json({ updatedViolation, newApproval });
    } catch (error) {
        console.error("[updateStatus]", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
