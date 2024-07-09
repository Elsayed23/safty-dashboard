import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        const { violation_id, user_id } = await req.json();

        if (!violation_id || !user_id) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // Check if the user has already made an approval for this violation
        const existingApproval = await db.userViolationApproval.findFirst({
            where: {
                user_id,
                violation_id,
            },
        });

        if (existingApproval) {
            return new NextResponse('Approval already exists', { status: 400 });
        }

        // Add a new approval entry if none exists
        const newApproval = await db.userViolationApproval.create({
            data: {
                user_id,
                violation_id,
            },
        });

        return NextResponse.json(newApproval);
    } catch (error) {
        console.error("[addApproval]", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
