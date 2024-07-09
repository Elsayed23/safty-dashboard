import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        const { user_id, supervisor_id } = await req.json();

        // Find the supervisor user by email
        const supervisor = await db.user.findUnique({
            where: { id: supervisor_id },
        });

        if (!supervisor) {
            return new NextResponse('Supervisor not found', { status: 404 });
        }

        // Update the subordinate user to link the supervisor
        await db.user.update({
            where: { id: user_id },
            data: {
                supervisors: {
                    create: {
                        supervisorId: supervisor.id,
                    },
                },
            },
        });

        return NextResponse.json({ message: "done" });
    } catch (error) {
        console.log("[user-update]", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
