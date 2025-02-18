'use client'
import { IoDocumentOutline, IoLocationSharp } from "react-icons/io5";
import { IoDocument } from "react-icons/io5";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import { FaHouse, FaPersonChalkboard, FaRegNewspaper } from "react-icons/fa6";
import React, { useEffect, useState } from 'react';
import SideItems from './SideItems';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { MdPeople, MdPolicy } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import InstrumentsDropdown from '@/app/(dashboard)/(routes)/_components/InstrumentsDropdown';
import { RiFilePaper2Fill, RiOrganizationChart } from "react-icons/ri";
import { FaUsers } from "react-icons/fa6";
import { useAuth } from "@/app/context/AuthContext";
import { FaPencilRuler } from "react-icons/fa";
import { FiLayout } from "react-icons/fi";
import axios from "axios";
import AddPlaceModal from "../(routes)/_components/AddPlaceModal";
import { IoIosWarning } from "react-icons/io";


const SidebarRoutes = () => {
    const router = useRouter();
    const { user } = useAuth();
    const pathname = usePathname();
    const [places, setPlaces] = useState(null)

    const fetchPlaces = async () => {
        try {

            const { data } = await axios.get('/api/places')
            setPlaces(data)

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchPlaces()
    }, [])

    // Define routes
    const routes = [
        {
            icon: FaPersonChalkboard,
            isAvtiveIcon: FaPersonChalkboard,
            label: 'Trainings',
            href: '/trainings'
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
        {
            icon: IoIosWarning,
            isAvtiveIcon: IoIosWarning,
            label: 'Incident',
            href: '/incident'
        },
    ];

    // Add admin-specific routes
    if (user?.role?.name === 'Admin') {
        routes.unshift({
            icon: FaPencilRuler,
            isAvtiveIcon: FaPencilRuler,
            label: 'Job titles',
            href: '/job_titles'
        });
        routes.unshift({
            icon: FaUsers,
            isAvtiveIcon: FaUsers,
            label: 'Users',
            href: '/users'
        });
    }

    // Define information routes
    const informationRoutes = [
        {
            icon: FaRegNewspaper,
            isAvtiveIcon: FaRegNewspaper,
            label: 'General data',
            href: '/information/general_data'
        },
        {
            icon: FiLayout,
            isAvtiveIcon: FiLayout,
            label: 'Layout',
            href: '/information/layout'
        },
        {
            icon: RiOrganizationChart,
            isAvtiveIcon: RiOrganizationChart,
            label: 'Memes & Statement',
            href: '/information/memes'
        },
        {
            icon: MdPolicy,
            isAvtiveIcon: MdPolicy,
            label: 'Policy',
            href: '/information/policy'
        },
        {
            icon: RiOrganizationChart,
            isAvtiveIcon: RiOrganizationChart,
            label: 'Organization chart',
            href: '/information/organizationchart'
        },
    ];

    // Define activity routes
    const activityRoutes = [
        {
            icon: FaRegNewspaper,
            isAvtiveIcon: FaRegNewspaper,
            label: 'Risk assessment',
            href: '/activity/risk-assessment'
        },
        {
            icon: FiLayout,
            isAvtiveIcon: FiLayout,
            label: 'Permit to work',
            href: '/activity/ptw'
        },
        {
            icon: RiOrganizationChart,
            isAvtiveIcon: RiOrganizationChart,
            label: 'Personeel (TPT)',
            href: '/activity/activity3'
        },
    ];


    return (
        <div className='flex flex-col w-full'>
            {/* 1. Users */}
            {user?.role?.name === 'Admin' && (
                <SideItems
                    icon={FaUsers}
                    isAvtiveIcon={FaUsers}
                    label="Users"
                    href="/users"
                />
            )}

            {/* 2. Information */}
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger className='py-0 relative hover:no-underline text-[#ec7831] px-6 hover:text-[#fe5000ce] hover:bg-[#ec7831] hover:bg-opacity-10 duration-300'>
                        <div className={`flex items-center gap-2 py-4`}>
                            <IoLocationSharp size={23} className='text-[#ec7831]' />
                            Information
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="w-full">
                        {informationRoutes.map((route, idx) => (
                            <div className="pl-4" key={idx}>
                                <SideItems {...route} />
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* 3. Trainings */}
            <SideItems
                icon={FaPersonChalkboard}
                isAvtiveIcon={FaPersonChalkboard}
                label="Trainings"
                href="/trainings"
            />

            {/* 4. Inspections */}
            <Accordion type="single" collapsible onClick={() => pathname !== '/instruments' && router.push('/instruments')}>
                <AccordionItem value="item-2">
                    <AccordionTrigger className='py-0 relative hover:no-underline text-[#ec7831] px-6 hover:text-[#fe5000ce] hover:bg-[#ec7831] hover:bg-opacity-10 duration-300'>
                        <div className={`flex items-center gap-2 py-4`}>
                            <IoDocument size={23} className='text-[#ec7831]' />
                            Inspection
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="w-full">
                        <InstrumentsDropdown />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* 5. Activity */}
            <Accordion type="single" collapsible>
                <AccordionItem value="item-3">
                    <AccordionTrigger className='py-0 relative hover:no-underline text-[#ec7831] px-6 hover:text-[#fe5000ce] hover:bg-[#ec7831] hover:bg-opacity-10 duration-300'>
                        <div className={`flex items-center gap-2 py-4`}>
                            <HiOutlineWrenchScrewdriver size={23} className='text-[#ec7831]' />
                            Activity
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="w-full">
                        <ul className="flex flex-col gap-2 p-4">
                            {
                                places?.length
                                    ?
                                    places.map(({ name, id }, idx) => {
                                        return (
                                            <li key={idx} onClick={() => router.push(`/place/${id}?name=${name}`)} className={`py-2 pl-6 cursor-pointer w-full rounded-sm hover:bg-black  ${pathname.includes(id) && 'bg-black bg-opacity-10'} hover:bg-opacity-10 duration-200`}>
                                                {name}
                                            </li>
                                        )
                                    })
                                    :
                                    <p className="text-center">There are no places.</p>
                            }
                        </ul>
                        {
                            user?.role?.name === 'Admin' || user?.role?.name === 'Engineer'
                                ?
                                <>
                                    <AddPlaceModal fetchPlaces={fetchPlaces} />
                                    Permitsssss
                                </>
                                :
                                ''
                        }
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* 6. Job Titles */}
            {user?.role?.name === 'Admin' && (
                <SideItems
                    icon={FaPencilRuler}
                    isAvtiveIcon={FaPencilRuler}
                    label="Job titles"
                    href="/job_titles"
                />
            )}

            {/* 7. Trainees */}
            <SideItems
                icon={MdPeople}
                isAvtiveIcon={MdPeople}
                label="Trainees"
                href="/trainees"
            />

            {/* 8. Violations */}
            <SideItems
                icon={IoIosWarning}
                isAvtiveIcon={IoIosWarning}
                label="Incident"
                href="/incident"
            />
            <SideItems
                icon={RiFilePaper2Fill}
                isAvtiveIcon={RiFilePaper2Fill}
                label="Violations"
                href="/violations"
            />
        </div>
    );
};

export default SidebarRoutes;