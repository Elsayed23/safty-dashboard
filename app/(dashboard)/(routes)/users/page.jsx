import React from 'react'
import UsersDataTable from './_components/UsersDataTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const page = () => {

    return (
        <div className="flex flex-col gap-5 p-6">
            <Link href='/users/add'>
                <Button className='flex bg-[#FE5000] hover:bg-[#fe5000e1] items-center self-start gap-1'>Add user</Button>
            </Link>
            <UsersDataTable />
        </div>
    )
}

export default page