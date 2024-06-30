'use client'
import { IoDocumentOutline } from "react-icons/io5";
import { IoDocument } from "react-icons/io5";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import { FaHouse, FaPersonChalkboard } from "react-icons/fa6";
import React from 'react'
import SideItems from './SideItems'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import InstrumentsDropdown from '@/app/(dashboard)/(routes)/_components/InstrumentsDropdown'

const SidebarRoutes = () => {

    const router = useRouter()

    const pathname = usePathname()

    const inspectionRoutes = [
        {
            icon: HiOutlineWrenchScrewdriver,
            isAvtiveIcon: HiWrenchScrewdriver,
            label: 'Instruments',
            href: '/instruments'
        },
    ]

    const routes = [
        {
            icon: FaPersonChalkboard,
            isAvtiveIcon: FaPersonChalkboard,
            label: 'Trainings',
            href: '/trainings'
        },
    ]



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