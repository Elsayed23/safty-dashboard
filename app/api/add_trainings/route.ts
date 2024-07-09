import { db } from "@/lib/db";

import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const { instructor_id, training_id, user_id } = await req.json()
        console.log(instructor_id, training_id, user_id);

        await db.training.create({
            data: {
                instructor_id,
                training_id,
                user_id
            }
        })

        return NextResponse.json({ message: 'Added Training' })

    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}