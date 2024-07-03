'use client'
import Loading from '@/app/(dashboard)/_components/Loading'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Slider from '../../../_components/ImagesSlider'

const page = ({ params: { violationId } }) => {

    const [violationData, setViolationData] = useState(null)

    const getViolation = async () => {
        try {
            const { data } = await axios.get(`/api/violations/${violationId}`)
            setViolationData(data)
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getViolation()
    }, [])

    console.log(violationData);

    if (!violationData) {
        return <Loading />
    }


    return (
        <div className="flex items-center min-h-[calc(100vh-80px)] flex-col gap-5 py-12 px-4">
            <h1 className='text-4xl font-semibold mb-12'>Violation details</h1>
            <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col items-center gap-2 border px-6 py-4 rounded-md">
                    <Image src={violationData?.user?.user_photo} alt='user_photo' width={128} height={128} className='w-32 h-32 rounded-full border' />
                    <h2>{violationData?.user?.name} | {violationData?.user?.job_title?.title}</h2>
                </div>
                <h2 className='text-xl font-semibold'> {violationData?.name} </h2>
                <p className='font-medium text-slate-900 max-w-lg'><span className='font-semibold'>Description</span>: {violationData?.description} </p>
                <span className='text-sm'>Violation status: {violationData?.status} </span>
                <div className="flex items-center gap-9">
                    {/* <Button variant='destructive' onClick={async () => await handleDeleteInstrument(instrumentId)}>Remove instrument</Button> */}
                </div>
            </div>
            <Slider images={violationData?.images} />
        </div>
    )
}

export default page