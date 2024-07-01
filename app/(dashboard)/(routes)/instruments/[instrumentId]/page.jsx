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
            const { images } = data
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
            <div className='h-[calc(100vh-80px)] flex'>
                <div id='tests' className="flex flex-col w-full px-4 pt-20">

                    <TestsTypeTabs instrumentData={instrumentData} instrumentId={instrumentId} testsData={testsData} id={instrumentId} />
                </div>

            </div>
        </>


    )
}

export default page