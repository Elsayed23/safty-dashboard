// pages/api/getPins.js
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const GET = async () => {
    try {
        const pins = await db.pin.findMany({
            include: { user: true }, // Include user information
        });
        return NextResponse.json(pins);
    } catch (error) {
        console.error("[getPins]", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};
export const POST = async (req: Request) => {
    try {
        const { lat, lng, icon, name, data, userId } = await req.json();
        await db.pin.create({
            data: {
                lat,
                lng,
                icon,
                name,
                data,
                userId,
            },
        });
        const pins = await db.pin.findMany({
            include: { user: true }, // Include user information
        });
        return NextResponse.json(pins);
    } catch (error) {
        console.error("[createPin]", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};
