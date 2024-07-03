import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const instrumentFiles = await db.instrumentsFiles.findMany({
            where: { instrumentId: id },
        });

        const instrumentImages = await db.instrumentImage.findMany({
            where: { instrumentId: id },
        });

        return NextResponse.json({ images: instrumentImages, files: instrumentFiles });

    } catch (error) {
        console.log("[getFiles]", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
