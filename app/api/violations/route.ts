import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust the import according to your setup
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const status = formData.get("status") as string;
        const user_id = formData.get("user_id") as string;
        const files = formData.getAll("images") as File[];
        const approvals = formData.getAll("approvals") as string[];

        // Create new violation
        const violation = await db.violation.create({
            data: {
                name,
                description,
                status,
                user_id,
            },
        });

        // Save files to local server and create ViolationImage entries
        const imagePromises = files.map(async (file) => {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = path.join('/uploads', fileName);
            fs.writeFileSync(path.join('./public', filePath), buffer);

            await db.violationImages.create({
                data: {
                    path: filePath,
                    violation_id: violation.id,
                },
            });
        });

        await Promise.all(imagePromises);

        // Create approval entries
        const approvalPromises = approvals.map(async (user_id) => {
            await db.userViolationApproval.create({
                data: {
                    user_id,
                    violation_id: violation.id,
                },
            });
        });

        await Promise.all(approvalPromises);

        return NextResponse.json(violation);

    } catch (error) {
        console.error("[violations]", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}


export async function GET(req: Request) {
    try {
        const violations = await db.violation.findMany({
            include: {
                approvals: {
                    include: {
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
                        work_id: true
                    }
                }
            }
        })

        return NextResponse.json(violations)

    } catch (error) {
        console.error("[violations]", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}