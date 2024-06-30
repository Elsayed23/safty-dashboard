import { db } from '@/lib/db';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import { NextResponse } from 'next/server';


const generateToken = (userId: string, name: string, email: string, address: string, supervisor: string, telephone: string, role: string, user_photo: string | null) => {
    return jwt.sign({ id: userId, name, email, address, supervisor, telephone, role, user_photo }, process.env.NEXT_PUBLIC_JWT_SECRET, { expiresIn: '3d' });
};

export async function POST(req: Request) {
    const { name, email, password, address, supervisor, telephone, role, user_photo } = await req.json();

    try {
        // Check if user already exists
        const userExists = await db.user.findUnique({ where: { email } });
        if (userExists) return NextResponse.json({ status: 400, message: "User already exists" });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                address,
                supervisor,
                telephone,
                role,
                user_photo
            }
        });

        const token = generateToken(newUser.id, newUser.name, newUser.email, newUser.address, newUser.supervisor, newUser.telephone, newUser.role, newUser.user_photo);
        return NextResponse.json({ status: 200, message: 'Registered successfully!', token, user: newUser });


    } catch (err) {
        console.log(err);

    }
}