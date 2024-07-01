'use client'
import { Button } from '@/components/ui/button'
import { CirclePlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import Card from './_components/Card'
import { useInstrument } from '@/app/context/InstrumentContext'
import Loading from '@/app/(dashboard)/_components/Loading'
import InstrumentDataTable from './_components/InstrumentDataTable'

const page = () => {

    const router = useRouter()

    const { instrumentType } = useInstrument()

    return (
        <div className='py-6 px-4 flex flex-col gap-6'>
            {
                instrumentType
                &&
                <Button variant='default' onClick={() => router.push(`/instruments/add?instrument_type_id=${instrumentType}`)} className='flex bg-[#FE5000] hover:bg-[#fe5000e1] items-center self-start gap-1'>Add instruments <CirclePlus size={18} /></Button>
            }
            <InstrumentDataTable />
        </div>

    )
}

export default page