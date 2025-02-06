import React from 'react'
import dynamic from 'next/dynamic';

const MapWithPins = dynamic(() => import('./_components/MapWithPins'), { ssr: false });

const page = () => {
  return (
    <div className='p-6'>
      <MapWithPins />
    </div>
  )
}

export default page