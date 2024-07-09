import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import path from 'path';
import fs from 'fs';

export const POST = async (req: Request) => {
    try {
        const formData = await req.formData();
        const instrumentId = formData.get("instrumentId") as string;
        const files = formData.getAll("files") as File[];

        if (!instrumentId) {
            return NextResponse.json({ status: 400, message: "Instrument ID is required" });
        }

        const imagePromises = files.filter(file => file.type.startsWith('image/')).map(async (file) => {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = path.join('/uploads', fileName);
            fs.writeFileSync(path.join('./public', filePath), buffer);

            await db.instrumentImage.create({
                data: {
                    path: filePath,
                    instrumentId: instrumentId,
                },
            });
        });

        const otherFilePromises = files.filter(file => !file.type.startsWith('image/')).map(async (file) => {
            console.log(file);

            const arrayBuffer = await file.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = path.join('/uploads', fileName);
            fs.writeFileSync(path.join('./public', filePath), buffer);

            await db.instrumentsFiles.create({
                data: {
                    name: file.name,
                    path: filePath,
                    instrumentId: instrumentId,
                },
            });
        });

        await Promise.all([...imagePromises, ...otherFilePromises]);

        return NextResponse.json({ status: 200, message: 'Files uploaded successfully!' });

    } catch (error) {
        console.log("[upload]", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
