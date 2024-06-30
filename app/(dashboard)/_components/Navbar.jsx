'use client'
import React from 'react'
import MobileSideBar from './MobileSideBar'
import { useRouter } from 'next/navigation'
import ProfileDropdown from './ProfileDropdown'

const Navbar = () => {

    const router = useRouter()




    return (
        <div className='h-20 md:pl-56 fixed top-0 w-full z-50'>
            <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
                <MobileSideBar />
                <div className="flex items-center gap-2 ml-auto">

                    <ProfileDropdown />

                </div>
            </div>
        </div>
    )
}

export default Navbar