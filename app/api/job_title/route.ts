import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        // Fetch job titles from the database
        const jobTitles = await db.jobTitle.findMany();

        // Define the desired order of job titles
        const desiredOrder = [
            { id: 'manager', title: 'Manager' },
            { id: 'engineer', title: 'Engineer' },
            { id: 'instructor', title: 'Instructor' },
            { id: 'supervisor', title: 'Supervisor' },
            { id: 'foreman', title: 'Foreman' },
            { id: 'officer', title: 'Officer' }, // Corrected typo in "Officer"
            { id: 'labourer', title: 'Labourer' }
        ];

        // Combine the "All" option with the fetched job titles
        const sortedJobTitles = [
            ...desiredOrder.filter(item => item.id === 'all'), // Add "All" first
            ...jobTitles.sort((a, b) => {
                const indexA = desiredOrder.findIndex(item => item.title.toLowerCase() === a.title.toLowerCase());
                const indexB = desiredOrder.findIndex(item => item.title.toLowerCase() === b.title.toLowerCase());
                return indexA - indexB; // Sort based on the desired order
            })
        ];

        return NextResponse.json(sortedJobTitles);

    } catch (error) {
        console.log("[job_titles]", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};

export const POST = async (req: Request) => {
    try {

        const { title } = await req.json()

        await db.jobTitle.create({
            data: {
                title
            }
        })

        const getJobTitles = await db.jobTitle.findMany()


        return NextResponse.json(getJobTitles)


    } catch (error) {
        console.log("[job_titles]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export const DELETE = async (req: Request) => {
    try {

        const { id } = await req.json()


        await db.jobTitle.delete({
            where: {
                id
            }
        })


        const getJobTitles = await db.jobTitle.findMany()


        return NextResponse.json(getJobTitles)

    } catch (error) {
        console.log("[job_titles]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}