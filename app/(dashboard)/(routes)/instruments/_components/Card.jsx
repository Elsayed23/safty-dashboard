'use client'
import { useTests } from '@/app/context/TestContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'
import React from 'react'
import { HiWrenchScrewdriver } from "react-icons/hi2";
import { FaTrash } from "react-icons/fa6";
import { useInstrument } from '@/app/context/InstrumentContext';

const Card = ({
    id,
    name,
    createdAt,
    type
}) => {

    const router = useRouter()
    const { handleDeleteInstrument } = useInstrument()


    return (
        <div className='border relative rounded-md flex flex-col items-center gap-3 px-6 py-3 '>
            <div className="absolute left-0 top-0 w-full h-full cursor-pointer" onClick={() => router.push(`/instruments/${id}`)}></div>
            <HiWrenchScrewdriver size={23} className='text-slate-800' />
            <h3 className='text-lg font-semibold text-slate-900'> {name} </h3>
            <h3 className='text-lg font-semibold text-slate-900'>نوع المُعدة: {type?.name} </h3>
            <span className='text-slate-500 text-sm font-medium'> تاريخ الإضافة: <span dir='ltr' className='break-words text-nowrap'>{new Date(createdAt).toLocaleString('ar-EG')}</span></span>
            <Button variant='destructive' onClick={() => handleDeleteInstrument(id)} size='sm' className='flex relative z-50 self-start'><FaTrash size={13} /></Button>
        </div>
    )
}

export default Card