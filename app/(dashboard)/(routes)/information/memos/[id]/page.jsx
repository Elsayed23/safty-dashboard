import React from 'react'

const page = ({
    params: { id }
}) => {
    return (
        <div className='p-6'>id is ==== {id}</div>
    )
}

export default page