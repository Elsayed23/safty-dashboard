import { Menu } from 'lucide-react'
import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from '@/components/ui/sheet'
import Sidebar from './Sidebar'

const MobileSideBar = () => {

    return (
        <Sheet >
            <SheetTrigger dir='ltr' className='md:hidden pr-4 hover:opacity-75 transition'>
                <Menu />
            </SheetTrigger>
            <SheetContent side='right' dir='rtl' className='p-0 bg-white'>
                <Sidebar />
            </SheetContent>
        </Sheet>
    )
}

export default MobileSideBar