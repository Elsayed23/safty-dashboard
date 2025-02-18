import Image from 'next/image'
import React from 'react'
import { BsThreeDots } from "react-icons/bs";

const DataRow = ({
    icon,
    title,
    content
}) => {
    return (
        <div className='p-4 bg-[#FDDECC] rounded-md shadow-md'>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Image src={icon} alt={title} width={48} height={48} className='w-12 h-12' />
                    <div className="flex flex-col gap-1">
                        <h5 className='font-normal text-sm text-[#000000A6]'>{title}</h5>
                        <p className='font-bold text-2xl text-[#000000BF]'>{content}</p>
                    </div>
                </div>
                <BsThreeDots size={20} className='cursor-pointer' />
            </div>
        </div>
    )
}

export default DataRow