// pages/api/login.js
import { db } from '@/lib/db';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import { NextResponse } from 'next/server';

const generateToken = (userId: string, name: string, work_id: string | null, email: string, address: string, telephone: string, job_title: any, job_title_id: string | null, role: any, user_photo: string | null) => {
    return jwt.sign({ id: userId, name, work_id, email, address, telephone, job_title, job_title_id, role, user_photo }, process.env.NEXT_PUBLIC_JWT_SECRET, { expiresIn: '3d' });
};

export async function POST(req: Request) {
    const { email, password } = await req.json();

    try {
        // Find user by email
        const user = await db.user.findUnique({ where: { email }, include: { job_title: true, role: true } });
        if (!user) {
            return NextResponse.json({ status: 400, message: "Incorrect email" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ status: 400, message: "Incorrect password" });
        }

        // Generate JWT token
        const token = generateToken(user.id, user.name, user.work_id, user.email, user.address, user.telephone, user?.job_title?.title, user.job_titleId, user.role, user.user_photo);

        // Respond with token and user details
        return NextResponse.json({ status: 200, token, user, message: 'Logged in successfully!' });
    } catch (err) {
        return NextResponse.json({ status: 500, message: err });
    }
}
