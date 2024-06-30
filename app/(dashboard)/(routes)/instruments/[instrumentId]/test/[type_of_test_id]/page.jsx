'use client'
import Loading from '@/app/(dashboard)/_components/Loading'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Page = ({ params: { instrumentId, type_of_test_id } }) => {
    const [test, setTest] = useState(null)
    const [selectedChecks, setSelectedChecks] = useState({})

    const router = useRouter()

    const getTypeOfTest = async () => {
        const { data } = await axios.get(`/api/type_of_test/${type_of_test_id}`)
        setTest(data)
    }

    const saveTest = async () => {
        const testEntriesChecks = test.testEntries.map(entry => ({
            testCheckName: entry.testCheckName,
            check: !!selectedChecks[entry.id]
        }))

        const data = {
            instrumentId,
            typeOfTestId: type_of_test_id,
            typeOfTestName: test.name,
            testEntriesChecks
        }

        try {
            await axios.post('/api/tests', data)
            router.push(`/instruments/${instrumentId}`)
        } catch (error) {
            console.error('Error saving data:', error)
            alert('Failed to save data.')
        }
    }

    useEffect(() => {
        getTypeOfTest()
    }, [])

    const handleCheckboxChange = (testEntryId) => {
        setSelectedChecks(prevState => ({
            ...prevState,
            [testEntryId]: !prevState[testEntryId]
        }))
    }

    if (!test) {
        return <Loading />
    }

    return (
        <div className='h-[calc(100vh-80px)] flex justify-center flex-col items-center px-4'>
            <div className="px-5 py-4 flex flex-col gap-9 w-full sm:w-[250px] border rounded-md">
                <h2 className='text-xl font-semibold text-center'> {test.name} </h2>
                <ul className='flex flex-col gap-5'>
                    {test.testEntries.map((entry, idx) => (
                        <li key={entry.id} className='flex items-center justify-between gap-3'>
                            <label htmlFor={entry.id}
                                className='text-[#fe5000e1] hover:opacity-80 leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                            >{idx + 1}-{entry.testCheckName}</label>

                            <Checkbox id={entry.id} onCheckedChange={() => handleCheckboxChange(entry.id)}
                                checked={!!selectedChecks[entry.id]} />
                        </li>
                    ))}
                </ul>
                <Button onClick={saveTest} variant='outline' className='w-fit hover:bg-[#FE5000] hover:text-white'>حفظ</Button>
            </div>
        </div>
    )
}

export default Page
