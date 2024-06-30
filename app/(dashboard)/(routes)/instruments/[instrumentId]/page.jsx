'use client'
import React, { useEffect, useState } from 'react'
import TestsTypeTabs from './_components/TestsTypeTabs'
import { instrumentsData } from '@/app/constants'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTests } from '@/app/context/TestContext'
import Loading from '@/app/(dashboard)/_components/Loading'
import axios from 'axios'

const page = ({ params: { instrumentId } }) => {

    const { handleDeleteInstrument } = useTests()

    const [loading, setLoading] = useState(true)
    const [testsLoading, setTestsLoading] = useState(true)

    const [instrumentData, setInstrumentData] = useState([])
    const [testsData, setTestsData] = useState([])

    const getTests = async () => {
        try {
            const { data } = await axios.get(`/api/tests?instrumentId=${instrumentId}`)
            setTestsData(data);
        } catch (error) {
            console.log(error);
        } finally {
            setTestsLoading(false)
        }
    }



    const getInstrumentById = async () => {
        try {
            const { data } = await axios.get(`/api/instruments/${instrumentId}`)

            setInstrumentData(data)
        } catch (error) {
            console.error('Error fetching instrument:', error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getInstrumentById()
        getTests()
    }, [])

    if (loading || testsLoading) {
        return <Loading />
    }

    return (

        <>
            <div className='h-[calc(100vh-80px)] flex justify-center items-center'>
                <div className="flex flex-col items-center gap-4 border py-9 px-4 rounded-md">
                    <h2 className='text-xl font-semibold'> {instrumentData?.name} </h2>
                    <h3 className='text-lg font-semibold text-slate-900'>نوع المُعدة: {instrumentData?.type?.name} </h3>
                    <span className='text-sm'>تاريخ الإضافة: {new Date(instrumentData?.createdAt).toLocaleString('ar-EG')}</span>
                    <div className="flex items-center gap-9">
                        <Link href='#tests' className='text-sm underline text-sky-900'>إذهب للفحوصات</Link>
                        <Button variant='destructive' onClick={async () => await handleDeleteInstrument(instrumentId)}>حذف المُعدة</Button>
                    </div>
                </div>
            </div>
            <div id='tests' className="flex flex-col px-4 items-center justify-center gap-16 min-h-screen pt-20">
                <h1 className='text-6xl font-semibold text-center'>الفحوصات</h1>
                <TestsTypeTabs testsData={testsData} id={instrumentId} />
            </div>
        </>


    )
}

export default page