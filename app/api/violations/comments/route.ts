import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { violation_id, comment, commentedBy } = await req.json();

        if (!violation_id || !comment || !commentedBy) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // Check if the user who commented exists
        const userExists = await db.user.findUnique({
            where: { id: commentedBy }
        });

        if (!userExists) {
            return new NextResponse('User not found', { status: 404 });
        }

        // Add a new comment to the violation
        const newComment = await db.violationsComments.create({
            data: {
                comment: comment,
                commentedBy: commentedBy,
                violationId: violation_id,
            },
        });

        return NextResponse.json({ newComment });
    } catch (error) {
        console.error("[addComment]", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {

        const violation_id = req.nextUrl.searchParams.get('violation_id');

        if (!violation_id) {
            return new NextResponse('Missing violation_id parameter', { status: 400 });
        }

        // Retrieve all comments for the given violation
        const comments = await db.violationsComments.findMany({
            where: { violationId: violation_id },
            include: {
                user: true,  // Include user details who made the comment
            },
        });

        return NextResponse.json(comments);
    } catch (error) {
        console.error("[getComments]", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}