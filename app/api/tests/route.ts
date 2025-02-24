import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
const path = require('path');
const fs = require('fs');

export const POST = async (req: Request) => {
    try {
        const formData = await req.formData();

        // Extract form data
        const instrumentId = formData.get('instrumentId') as string;
        const typeOfTestId = formData.get('typeOfTestId') as string;
        const typeOfTestName = formData.get('typeOfTestName') as string;
        const testEntriesChecks = JSON.parse(formData.get('testEntriesChecks') as string); // Array of test entries
        const images = formData.getAll('images') as File[]; // Array of uploaded images

        // Create the test in the database
        const test = await db.test.create({
            data: {
                instrumentId,
                typeOfTestId,
                typeOfTestName,
                testEntriesChecks: {
                    create: testEntriesChecks.map((entry: any) => ({
                        testCheckName: entry.testCheckName,
                        check: entry.check,
                        comment: entry.comment,
                    })),
                },
            },
            include: {
                testEntriesChecks: true,
            },
        });

        // Save uploaded images to the server and associate them with test entries
        const imagePromises = images.map(async (file, index) => {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = path.join('/uploads', fileName);

            // Save the file to the server
            fs.writeFileSync(path.join('./public', filePath), buffer);

            // Associate the image with the corresponding test entry
            const testEntryId = test.testEntriesChecks[index].id;
            await db.testEntryCheck.update({
                where: { id: testEntryId },
                data: { image: filePath },
            });
        });

        await Promise.all(imagePromises);

        return NextResponse.json(test);
    } catch (error) {
        console.log('[test]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};


export async function GET(req: NextRequest) {
    try {
        const instrumentId = req.nextUrl.searchParams.get('instrumentId')

        const test = await db.test.findMany({
            where: {
                instrumentId: instrumentId as string,
            },
            include: {
                testEntriesChecks: true,
                typeOfTest: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return NextResponse.json(test)

    } catch (error) {
        console.log("[test]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}