'use client'
import React from 'react'
import { useAuth } from '@/app/context/AuthContext'

const page = () => {

    const { user } = useAuth()

    console.log(user);

    return (
        <div className='p-6'>page</div>
    )
}

export default page