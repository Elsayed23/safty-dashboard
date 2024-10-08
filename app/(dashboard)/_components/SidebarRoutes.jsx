'use client'
import { IoDocumentOutline, IoLocationSharp } from "react-icons/io5";
import { IoDocument } from "react-icons/io5";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import { FaHouse, FaPersonChalkboard } from "react-icons/fa6";
import React, { useEffect } from 'react'
import SideItems from './SideItems'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils";
import { MdPeople } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import InstrumentsDropdown from '@/app/(dashboard)/(routes)/_components/InstrumentsDropdown'
import { RiFilePaper2Fill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa6";
import { useAuth } from "@/app/context/AuthContext";
import { FaPencilRuler } from "react-icons/fa";

const SidebarRoutes = () => {

    const router = useRouter()

    const { user } = useAuth()

    const pathname = usePathname()

    const routes = [
        {
            icon: FaPersonChalkboard,
            isAvtiveIcon: FaPersonChalkboard,
            label: 'Trainings',
            href: '/trainings'
        },
        {
            icon: IoLocationSharp,
            isAvtiveIcon: IoLocationSharp,
            label: 'Information',
            href: '/information'
        },
        {
            icon: MdPeople,
            isAvtiveIcon: MdPeople,
            label: 'Trainees',
            href: '/trainees'
        },
        {
            icon: RiFilePaper2Fill,
            isAvtiveIcon: RiFilePaper2Fill,
            label: 'Violations',
            href: '/violations'
        },
    ]



    if (user?.role?.name === 'Admin') {
        routes.unshift({
            icon: FaPencilRuler,
            isAvtiveIcon: FaPencilRuler,
            label: 'Job titles',
            href: '/job_titles'
        }
        )
        routes.unshift({
            icon: FaUsers,
            isAvtiveIcon: FaUsers,
            label: 'Users',
            href: '/users'
        }
        )
    }





    return (
        <div className='flex flex-col w-full'>
            <Accordion type="single" collapsible onClick={() => pathname !== '/instruments' && router.push('/instruments')}>
                <AccordionItem value="item-1">
                    <AccordionTrigger className='py-0 relative hover:no-underline text-[#ec7831] px-6 hover:text-[#fe5000ce] hover:bg-[#ec7831] hover:bg-opacity-10 duration-300'>
                        <div className={`flex items-center gap-2  py-4`}>
                            <IoDocument size={23} className='text-[#ec7831]' />
                            Inspection
                        </div>

                    </AccordionTrigger>
                    <AccordionContent className="w-full">
                        <InstrumentsDropdown />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            {
                routes.map((routes, idx) => {
                    return <SideItems key={idx} {...routes} />
                })
            }
        </div>
    )
}

export default SidebarRoutes