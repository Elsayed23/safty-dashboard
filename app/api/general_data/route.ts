// pages/api/generalData.js
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const GET = async () => {
    try {
        const generalData = await db.generalData.findMany({
            include: {
                supervisor: true,
                siteManager: true,
            },
        });
        return NextResponse.json(generalData);
    } catch (error) {
        console.error("[generalData]", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};

export const POST = async (req: Request) => {
    try {
        const { name, supervisorId, siteManagerId } = await req.json();
        const newGeneralData = await db.generalData.create({
            data: {
                name,
                supervisorId,
                siteManagerId,
            },
        });
        return NextResponse.json(newGeneralData);
    } catch (error) {
        console.error("[generalData]", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};

export const PATCH = async (req: Request) => {
    try {
        const { id, name, supervisorId, siteManagerId } = await req.json();
        const updatedGeneralData = await db.generalData.update({
            where: { id },
            data: {
                name,
                supervisorId,
                siteManagerId,
            },
        });
        return NextResponse.json(updatedGeneralData);
    } catch (error) {
        console.error("[generalData]", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};

export const DELETE = async (req: Request) => {
    try {
        const { id } = await req.json();
        await db.generalData.delete({
            where: {
                id,
            },
        });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        console.error("[generalData]", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};
