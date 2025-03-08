import React from 'react';
import Navbar from './_components/Navbar';
import Sidebar from './_components/Sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className='h-full'>
            <Navbar />
            <div className="hidden md:flex flex-col w-60 h-full fixed top-0 bottom-0 z-50">
                <Sidebar />
            </div>
            <main className='md:pl-60 pt-20'>
                {/* <img src="/images/test.jpeg" alt="testt" className='absolute inset-0 w-full h-full' /> */}
                {children}
            </main>
        </div>
    );
};

export default Layout;
