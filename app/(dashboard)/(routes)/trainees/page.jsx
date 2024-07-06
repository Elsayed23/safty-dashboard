'use client'
import React, { useEffect, useState } from 'react'
import TraineesDataTable from './_components/TraineesDataTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from 'axios'

const page = () => {

  const [jobTitleId, setJobTitleId] = useState('')
  const [jobTitles, setJobTitles] = useState(null)

  const getJobTitles = async () => {
    const { data } = await axios.get("/api/job_title")
    setJobTitles(() => {
      return [
        {
          id: '',
          title: 'All'
        },
        ...data
      ]
    })
  }

  useEffect(() => {
    getJobTitles()
  }, [])


  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-center p-6 gap-3 w-full">
        <Tabs defaultValue="All" className="justify-center w-full">
          <TabsList className="grid w-full grid-cols-5 justify-center sm:w-3/4 md:w-[540px] lg:w-[560px] sm:mx-auto">
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
      <TraineesDataTable jobTitleId={jobTitleId} />
    </div>
  )
}

export default page