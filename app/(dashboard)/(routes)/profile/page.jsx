'use client'
import React from 'react'
import { useAuth } from '@/app/context/AuthContext'
import {
    Card,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import Loading from '../../_components/Loading'

const page = () => {

    const { user } = useAuth()

    return (
        user
            ?
            <div className='p-6 flex justify-center'>
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 justify-center sm:w-3/4 md:w-[540px] lg:w-[560px] sm:mx-auto">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="traninings" defaultChecked={true}>Traninings</TabsTrigger>
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
                                <h3 className='text-lg font-semibold'>Role</h3>
                                <div className="pl-4 flex items-center gap-4 py-4 border-t">
                                    <h3 className='text-sm font-medium tracking-wide'>{user?.role}</h3>
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
                        <Card className="flex flex-col items-center gap-9 py-3">
                            Test
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
            :
            <Loading />
    )
}

export default page