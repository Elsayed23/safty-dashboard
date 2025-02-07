import React from 'react'

const DataBox = ({
    title,
    content
}) => {
    return (
        <div className='p-6 rounded-md border flex items-center justify-between shadow-md backdrop-blur-lg'>
            <div>
                <h4 className='text-base font-medium text-black mb-2'>{title}</h4>
                <p className='text-3xl font-bold text-slate-900'>{content}</p>
            </div>
            {
                title === 'Consultant'
                &&
                <img src='/images/aeLogo.jpeg' className='w-44 h-14 object-cover rounded-md' />
            }
        </div>
    )
}

export default DataBox

// Consultant