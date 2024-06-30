import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
    req: Request,
) {
    try {

        const { name, typeId } = await req.json()

        const instrument = await db.instrument.create({
            data: {
                name,
                typeId
            }
        })

        return NextResponse.json(instrument)

    } catch (error) {
        console.log("[instruments]", error);
        return new NextResponse('Internal Error', { status: 500 })
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
