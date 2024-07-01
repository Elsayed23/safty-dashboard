// pages/api/login.js
import { db } from '@/lib/db';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import { NextResponse } from 'next/server';

const generateToken = (userId: string, name: string, email: string, address: string, telephone: string, user_photo: string | null) => {
    return jwt.sign({ id: userId, name, email, address, telephone, user_photo }, process.env.NEXT_PUBLIC_JWT_SECRET, { expiresIn: '3d' });
};

export async function POST(req: Request) {
    const { email, password } = await req.json();

    try {
        // Find user by email
        const user = await db.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ status: 400, message: "Incorrect email" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ status: 400, message: "Incorrect password" });
        }

        // Generate JWT token
        const token = generateToken(user.id, user.name, user.email, user.address, user.telephone, user.user_photo);

        // Respond with token and user details
        return NextResponse.json({ status: 200, token, user, message: 'Logged in successfully!' });
    } catch (err) {
        return NextResponse.json({ status: 500, message: err });
    }
}
