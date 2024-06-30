import { Loader } from 'lucide-react'
import React from 'react'

const Loading = ({ isFull }) => {
    return (
        <div className={`${isFull ? 'h-screen' : 'h-[calc(100vh-80px)]'} flex justify-center items-center`}>
            <Loader className='animate-spin' size={50} />
        </div>
    )
}

export default Loading