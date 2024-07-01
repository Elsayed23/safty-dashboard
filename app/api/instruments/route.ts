import { NextResponse } from "next/server";
import { db } from "@/lib/db";
const path = require('path')
const fs = require('fs')

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const name = formData.get("name") as string;
        const typeId = formData.get("typeId") as string;
        const place = formData.get("place") as string;
        const customInstrumentId = formData.get("customInstrumentId") as string;
        const files = formData.getAll("images") as File[];

        // Create new instrument
        const instrument = await db.instrument.create({
            data: {
                name,
                typeId,
                place,
                customInstrumentId,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        // Save files to local server and create InstrumentImage entries
        const imagePromises = files.map(async (file) => {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = path.join('/uploads', fileName);
            fs.writeFileSync(path.join('./public', filePath), buffer);

            await db.instrumentImage.create({
                data: {
                    path: filePath,
                    instrumentId: instrument.id,
                },
            });
        });

        await Promise.all(imagePromises);

        return NextResponse.json(instrument);

    } catch (error) {
        console.log("[instruments]", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}


export async function GET() {
    try {

        const instruments = await db.instrument.findMany({
            include: {
                type: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return NextResponse.json(instruments)

    } catch (error) {
        console.log("[instruments]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json()

        console.log(id);

        // Delete related TestEntryCheck records
        await db.testEntryCheck.deleteMany({
            where: {
                test: {
                    instrumentId: id
                }
            }
        })

        // Delete related TestEntry records
        await db.testEntry.deleteMany({
            where: {
                typeOfTest: {
                    instrumentId: id
                }
            }
        })

        // Delete related Test records
        await db.test.deleteMany({
            where: { instrumentId: id }
        })

        // Delete related TypeOfTest records
        await db.typeOfTest.deleteMany({
            where: { instrumentId: id }
        })

        // Now delete the instrument
        const deleteInstrument = await db.instrument.delete({
            where: {
                id
            }
        })

        return NextResponse.json(deleteInstrument)

    } catch (error) {
        console.log("[instruments]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}
