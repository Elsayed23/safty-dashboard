import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const isSupervisor = req.nextUrl.searchParams.get('isSupervisor');
        const isSiteManager = req.nextUrl.searchParams.get('isSiteManager');

        if (isSupervisor === 'true') {
            // Fetch users with a specific job title (Supervisor)
            const users = await db.user.findMany({
                where: {
                    job_titleId: 'df6c7dbc-3546-47e2-86df-e880a8c85a4c' // Assuming this is the Supervisor job title ID
                },
                select: {
                    id: true,
                    name: true,
                    work_id: true
                },
                orderBy: {
                    role: {
                        name: 'asc' // Order by role name (admins first)
                    }
                }
            });

            return NextResponse.json(users);
        } else if (isSiteManager === 'true') {
            // Fetch all users with minimal data (Site Manager)
            const users = await db.user.findMany({
                select: {
                    id: true,
                    name: true
                },
                orderBy: {
                    role: {
                        name: 'asc' // Order by role name (admins first)
                    }
                }
            });

            return NextResponse.json(users);
        } else {
            // Fetch all users with detailed information (Default)
            const users = await db.user.findMany({
                include: {
                    job_title: true,
                    violations: true,
                    role: true,
                    supervisors: true
                },
                orderBy: {
                    role: {
                        name: 'asc' // Order by role name (admins first)
                    }
                }
            });

            return NextResponse.json(users);
        }
    } catch (error) {
        console.error("[users]", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}