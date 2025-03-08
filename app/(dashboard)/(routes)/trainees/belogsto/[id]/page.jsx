'use client'
import React, { useEffect, useState } from 'react'
import TraineesDataTable from './_components/TraineesDataTable'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from 'axios'

const page = ({ params: { id } }) => {

    const [jobTitleId, setJobTitleId] = useState('all')
    const [jobTitles, setJobTitles] = useState(null)

    const getJobTitles = async () => {
        const { data } = await axios.get("/api/job_title")
        setJobTitles(() => {
            return [
                {
                    id: 'all',
                    title: 'All'
                },
                ...data
            ]
        })
    }
    console.log(jobTitles);

    useEffect(() => {
        getJobTitles()
    }, [])


    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-center p-6 gap-3 w-full">
                <Tabs defaultValue="All" className="justify-center w-full">
                    <TabsList className={`grid w-full grid-cols-8 justify-center sm:w-3/4 md:w-[540px] lg:w-4/5 sm:mx-auto`}>
                        {
                            jobTitles?.map(({ id, title }, idx) => {
                                return (
                                    <TabsTrigger key={idx} value={title} onClick={() => { setJobTitleId(id) }}>{title}</TabsTrigger>
                                )
                            })
                        }
                    </TabsList>
                </Tabs>

            </div>
            <TraineesDataTable jobTitleId={jobTitleId} belogstoId={id} />
        </div>
    )
}

export default page