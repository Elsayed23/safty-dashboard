'use client'
import React, { useState } from 'react'
import TraineesDataTable from './_components/TraineesDataTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const page = () => {

  const [jobTitleId, setJobTitleId] = useState('')

  const jobTitles = [
    {
      id: '',
      title: 'All'
    },
    {
      id: 'b41ae602-6482-45ba-8619-eeb2eb8f561b',
      title: 'Engineer'
    },
    {
      id: 'd29f8814-f78a-4ea3-a750-3d0195bf6677',
      title: 'Supervisor'
    },
    {
      id: '86db45bc-78d9-49b1-b9c2-2d49690fe2dd',
      title: 'Officer'
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-center p-6 gap-3 w-full">
        <Tabs defaultValue="All" className="justify-center w-full">
          <TabsList className="grid w-full grid-cols-4 justify-center sm:w-3/4 md:w-[540px] lg:w-[560px] sm:mx-auto">
            {
              jobTitles.map(({ id, title }, idx) => {
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