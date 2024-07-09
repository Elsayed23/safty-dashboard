'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import Image from 'next/image'
import Loading from '../../_components/Loading'
import axios from 'axios'
import Link from 'next/link'

const page = () => {

    const { user } = useAuth()

    const [trainings, setTrainings] = useState(null)
    const [violations, setViolations] = useState(null)

    const getUserData = async () => {
        try {
            if (user) {
                const trainingsData = await axios.get(`/api/add_trainings/${user?.id}`)
                const violationsData = await axios.get(`/api/violations/user/${user?.id}`)
                setTrainings(trainingsData.data);
                setViolations(violationsData.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    console.log(user);

    useEffect(() => {
        getUserData()
    }, [user])

    return (
        user && trainings
            ?
            <div className='p-6 flex justify-center'>
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 justify-center sm:w-3/4 md:w-[540px] lg:w-[560px] sm:mx-auto">
                        <TabsTrigger defaultChecked={true} value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="traninings" >Traninings</TabsTrigger>
                        <TabsTrigger value="violations">Violations</TabsTrigger>
                    </TabsList>
                    <TabsContent className='w-full' value="profile">
                        <div className="flex flex-col gap-8 rounded-lg border border-slate-200 shadow-sm p-5">
                            <h1 className='text-3xl font-bold'>Account</h1>
                            <div className="flex flex-col gap-3">
                                <h3 className='text-lg font-semibold'>Profile</h3>
                                <div className="pl-4 flex items-center gap-4 py-4 border-t">
                                    <Image src={user?.user_photo} alt='user photo' width={48} height={48} className='w-12 h-12 rounded-full' />
                                    <h3 className='text-sm font-medium tracking-wide'>{user?.name}</h3>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h3 className='text-lg font-semibold'>Job title</h3>
                                <div className="pl-4 flex items-center gap-4 py-4 border-t">
                                    <h3 className='text-sm font-medium tracking-wide'>{user?.job_title}</h3>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h3 className='text-lg font-semibold'>Role</h3>
                                <div className="pl-4 flex items-center gap-4 py-4 border-t">
                                    <h3 className='text-sm font-medium tracking-wide'>{user?.role ? user?.role?.name : 'no role'}</h3>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h3 className='text-lg font-semibold'>Supervisor</h3>
                                <div className="pl-4 flex items-center gap-4 py-4 border-t">
                                    <h3 className='text-sm font-medium tracking-wide'>{user?.supervisor[0]?.supervisor?.name ? user?.supervisor[0]?.supervisor?.name : 'no supervisor'}</h3>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h3 className='text-lg font-semibold'>Email addresses</h3>
                                <div className="pl-4 flex items-center gap-4 py-4 border-t">
                                    <h3 className='text-sm font-medium tracking-wide'>{user?.email}</h3>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h3 className='text-lg font-semibold'>Telephone</h3>
                                <div className="pl-4 flex items-center gap-4 py-4 border-t">
                                    <h3 className='text-sm font-medium tracking-wide'>{user?.telephone}</h3>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h3 className='text-lg font-semibold'>Address</h3>
                                <div className="pl-4 flex items-center gap-4 py-4 border-t">
                                    <h3 className='text-sm font-medium tracking-wide'>{user?.address}</h3>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent className='w-full' value="traninings">
                        <div className="flex flex-col rounded-lg border border-slate-200 shadow-sm p-5">
                            <h1 className='text-3xl font-bold mb-8'>Traninings</h1>
                            <h3 className='font-semibold mb-3'>{trainings?.length ? `results: ${trainings.length}` : 'You are not have any training'}</h3>
                            <ul className='flex flex-col gap-2 pl-5'>
                                {
                                    trainings?.map(({ training: { name } }, idx) => {
                                        return (
                                            <li key={idx}>{name}</li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </TabsContent>
                    <TabsContent className='w-full' value="violations">
                        <div className="flex flex-col rounded-lg border border-slate-200 shadow-sm p-5">
                            <h1 className='text-3xl font-bold mb-8'>Violations</h1>
                            <h3 className='font-semibold mb-3'>{violations?.length ? `results: ${violations.length}` : 'You are not have any violation'}</h3>
                            <ul className='flex flex-col gap-2 pl-5'>
                                {
                                    violations?.map(({ id, name }, idx) => {
                                        return (
                                            <Link key={idx} href={`/violations/${id}`} className='w-fit underline underline-offset-2'>{name}</Link>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            :
            <Loading />
    )
}

export default page