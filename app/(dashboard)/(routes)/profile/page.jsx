'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import Image from 'next/image'
import Loading from '../../_components/Loading'
import axios from 'axios'
import Link from 'next/link'
import QRCode from 'react-qr-code'
import { Button } from '@/components/ui/button'

const Page = () => {
    const { user } = useAuth()
    const [trainings, setTrainings] = useState(null)
    const [violations, setViolations] = useState(null)
    const qrRef = useRef(null)

    const getUserData = async () => {
        try {
            if (user) {
                const trainingsData = await axios.get(`/api/add_trainings/${user?.id}`)
                const violationsData = await axios.get(`/api/violations/user/${user?.id}`)
                setTrainings(trainingsData.data)
                setViolations(violationsData.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUserData()
    }, [user])

    // ✅ Fixed QR Code Download Function
    const downloadQRCode = () => {
        const svg = qrRef.current?.querySelector('svg')
        if (!svg) return

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = document.createElement('img')

        const svgData = new XMLSerializer().serializeToString(svg)
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(svgBlob)

        img.onload = () => {
            canvas.width = svg.clientWidth * 2
            canvas.height = svg.clientHeight * 2
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            URL.revokeObjectURL(url)

            const pngUrl = canvas.toDataURL('image/png')
            const downloadLink = document.createElement('a')
            downloadLink.href = pngUrl
            downloadLink.download = 'qr-code.png'
            document.body.appendChild(downloadLink)
            downloadLink.click()
            document.body.removeChild(downloadLink)
        }

        img.src = url // ✅ Assign src AFTER defining onload
    }

    return (
        user && trainings ? (
            <div className='p-6'>
                <h1 className='text-3xl font-bold py-1 border-l-4 pl-3 border-[#F75902]'>Profile</h1>
                <div className="flex items-center flex-col gap-4 justify-center">
                    <Image src={user?.user_photo} alt='user photo' width={250} height={250} className='w-[250px] h-[250px] rounded-full' />
                    <h3 className='text-2xl font-light'>{user?.name}</h3>
                </div>
                <div className="grid grid-cols-2 gap-y-8">
                    <h3 className='text-sm font-light tracking-wide'><span className='font-medium'>Job title: </span> {user?.job_title}</h3>
                    <h3 className='text-sm font-light tracking-wide pl-48'><span className='font-medium'>Role: </span> {user?.role ? user?.role?.name : 'no role'}</h3>
                    <h3 className='text-sm font-light tracking-wide'><span className='font-medium'>Supervisor: </span> {user?.supervisor[0]?.supervisor?.name ? user?.supervisor[0]?.supervisor?.name : 'no supervisor'}</h3>
                    <h3 className='text-sm font-light tracking-wide pl-48'><span className='font-medium'>Email addresses: </span>{user?.email}</h3>
                    <h3 className='text-sm font-light tracking-wide'><span className='font-medium'>Telephone: </span>{user?.telephone}</h3>
                    <h3 className='text-sm font-light tracking-wide pl-48'><span className='font-medium'>Address: </span>{user?.address}</h3>
                    <h3 className='text-sm font-light tracking-wide flex'><span className='font-medium'>Trainings: </span>
                        <ul className='list-disc p-[revert]'>
                            {trainings?.map(({ training: { name } }, idx) => (
                                <li key={idx}>{name}</li>
                            ))}
                        </ul>
                    </h3>
                    <h3 className='text-sm font-light tracking-wide flex pl-48'><span className='font-medium'>Violations: </span>
                        {violations?.length ? (
                            <ul className='list-disc p-[revert]'>
                                {violations?.map(({ id, name }, idx) => (
                                    <li key={idx}>
                                        <Link href={`/violations/${id}`} className='w-fit underline underline-offset-2'>{name}</Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>There are no violations.</p>
                        )}
                    </h3>
                </div>

                {/* QR Code Section */}
                <div className="flex flex-col items-center gap-4 mt-8">
                    <h3 className='text-lg font-semibold'>Employee QR Code</h3>
                    <div ref={qrRef} className="p-4 border border-slate-200 rounded-lg">
                        <QRCode
                            value={`${window.location.origin}/profile/${user?.id}`}
                            size={128}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            level="Q"
                        />
                    </div>
                    <Button
                        onClick={downloadQRCode}
                        variant='outline'
                    >
                        Download QR Code
                    </Button>
                </div>
            </div>
        ) : (
            <Loading />
        )
    )
}

export default Page
