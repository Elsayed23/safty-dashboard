'use client'
import React from 'react';
import DataBox from './_components/DataBox';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const page = () => {
    const projectProgress = 85;

    return (
        <div className='p-6'>
            <h1 className="text-4xl text-center font-bold mb-5">General Data</h1>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <DataBox title='Project Name' content='Sindalah' />
                    <DataBox title='Client Name' content='Neom' />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <DataBox title='Project Manager' content='Mohamed Saeed' />
                    <DataBox title='Safety Manager' content='Shidoo Saeed' />
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <DataBox title='Number of employees' content='+4k' />
                    <DataBox title='Number of working hours for security' content='+960k' />
                    <DataBox title='Number of injuries and accidents' content='+30' />
                    <DataBox title='Accident rate index' content='45' />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-md flex items-center justify-between backdrop-blur-lg border shadow-md">
                        <div className="flex flex-col">
                            <h2 className="text-base font-medium text-black mb-2">Project Progress</h2>
                            <p className='text-3xl font-bold text-slate-900'>85%</p>
                        </div>
                        <div className="w-20 h-20">
                            <CircularProgressbar
                                value={projectProgress}
                                text={`${projectProgress}%`}
                                styles={buildStyles({
                                    textSize: '16px',
                                    pathColor: `#ec7831`,
                                    textColor: '#000',
                                    trailColor: '#d1d5db',
                                })}
                            />
                        </div>
                    </div>
                    <DataBox title='Consultant' content='Any Consultant' />
                </div>
            </div>
        </div>
    );
};

export default page;
