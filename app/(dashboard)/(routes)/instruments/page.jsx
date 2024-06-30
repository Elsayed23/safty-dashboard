'use client'
import { Button } from '@/components/ui/button'
import { CirclePlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import Card from './_components/Card'
import { useInstrument } from '@/app/context/InstrumentContext'
import Loading from '@/app/(dashboard)/_components/Loading'

const page = () => {

    const router = useRouter()
    const { instruments, getInstruments, loading, instrumentType } = useInstrument()

    useEffect(() => {
        getInstruments()
    }, [])



    const instrumentsCard = instruments.map((instrument, idx) => {
        return (
            <Card key={idx} {...instrument} />
        )
    })

    return (
        !loading
            ?
            <div className='py-6 px-4 flex flex-col gap-16'>
                {
                    instrumentType
                    &&
                    <Button variant='default' onClick={() => router.push(`/instruments/add?instrument_type_id=${instrumentType}`)} className='flex bg-[#FE5000] hover:bg-[#fe5000e1] items-center self-start gap-1'>Add instruments <CirclePlus size={18} /></Button>
                }
                {
                    instruments?.length
                        ?
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                            {instrumentsCard}
                        </div>
                        :
                        <h3 className='text-sm font-medium text-slate-600'>There is no instruments</h3>
                }

            </div>
            :
            <Loading />
    )
}

export default page