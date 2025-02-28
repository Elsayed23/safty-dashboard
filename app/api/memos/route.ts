import { db } from "@/lib/db";
import { NextResponse } from "next/server";
const path = require('path')
const fs = require('fs')

export const GET = async () => {
    try {

        const memos = await db.memo.findMany({
            include: { user: true },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json(memos)

    } catch (error) {
        console.log(error);
    }
}

export const POST = async (req: Request) => {
    try {

        const formData = await req.formData()

        const title = formData.get('title') as string;
        const banner = formData.get('banner') as File;
        const content = formData.get('content') as string;
        const userId = formData.get('userId') as string;

        let bannerPath = null;

        if (banner) {
            const arrayBuffer = await banner.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);
            const fileName = `${Date.now()}-${banner.name}`;
            bannerPath = path.join('/uploads', fileName);
            fs.writeFileSync(path.join('./public', bannerPath), buffer);
        }

        await db.memo.create({
            data: {
                title,
                banner: bannerPath,
                content,
                userId,
            }
        })

        return NextResponse.json({ message: 'Memo created successfully!' })

    } catch (error) {
        console.log(error);
    }
}