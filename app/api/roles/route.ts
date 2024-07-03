import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {

        const roles = await db.role.findMany()

        return NextResponse.json(roles)

    } catch (error) {
        console.log("[role]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function PATCH(
    req: Request
) {
    try {

        const { user_id, role_id } = await req.json()



        await db.user.update({
            data: {
                roleId: role_id
            },
            where: {
                id: user_id
            }
        })

        return NextResponse.json({ message: 'Role updated' })

    } catch (error) {
        console.log("[role]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}