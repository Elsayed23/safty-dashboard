import React from 'react'
import dynamic from 'next/dynamic';
import GeneralDataComponent from './_components/GeneralDataComponent';

const MapWithPins = dynamic(() => import('./_components/MapWithPins'), { ssr: false });

const page = () => {
    return (
        <div className='p-6'>
            <GeneralDataComponent />
            <MapWithPins />
        </div>
    )
}

export default page