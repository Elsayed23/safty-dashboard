import React from 'react'
import SidebarRoutes from './SidebarRoutes'
import logo from '../../assets/images/logo.png'
import Image from 'next/image'
import Link from 'next/link'

const Sidebar = () => {
    return (
        <div className='flex flex-col h-full overflow-y-auto bg-slate-50 border-r'>
            <div className="p-8 mt-5 md:mt-0">
                <Link href='/'>
                    <Image src={logo} alt='logo' width={350} height={90} /></Link>
            </div>
            <div className="flex flex-col w-full">
                <SidebarRoutes />
            </div>
        </div>
    )
}

export default Sidebar