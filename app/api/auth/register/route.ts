import { db } from '@/lib/db';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import { NextResponse } from 'next/server';
const path = require('path')
const fs = require('fs')
const generateToken = (userId: string, name: string, email: string, address: string, telephone: string, user_photo: string | null) => {
    return jwt.sign({ id: userId, name, email, address, telephone, user_photo }, process.env.NEXT_PUBLIC_JWT_SECRET, { expiresIn: '3d' });
};

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const address = formData.get("address") as string;
        const telephone = formData.get("telephone") as string;
        const file = formData.get("user_photo") as File;

        // Check if user already exists
        const userExists = await db.user.findUnique({ where: { email } });
        if (userExists) return NextResponse.json({ status: 400, message: "User already exists" });

        // Save file to local server
        let userPhotoPath = '';
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);
            const fileName = `${Date.now()}-${file.name}`;
            userPhotoPath = path.join('/uploads', fileName);
            fs.writeFileSync(path.join('./public', userPhotoPath), buffer);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                address,
                telephone,
                user_photo: userPhotoPath,
            },
        });

        const token = generateToken(newUser.id, newUser.name, newUser.email, newUser.address, newUser.telephone, newUser.user_photo);

        return NextResponse.json({ status: 200, message: 'Registered successfully!', token, user: newUser });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ status: 'fail', error: err });
    }
}
