import { Loader } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import spinner from '@/app/assets/images/spinner.png'

const Loading = ({ isFull }) => {
    return (
        <div className={`${isFull ? 'h-screen' : 'h-[calc(100vh-80px)]'} flex justify-center bg-white z-50 fixed top-20 right-0 w-[calc(100%-224px)] items-center`}>
            <Image src={spinner} alt='spinnner' width={60} height={60} className='animate-spin' />
        </div>
    )
}

export default Loading