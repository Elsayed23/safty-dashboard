'use client'
import Loading from '@/app/(dashboard)/_components/Loading'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Page = ({ params: { instrumentId, type_of_test_id } }) => {
    const [test, setTest] = useState(null)
    const [selectedChecks, setSelectedChecks] = useState({})
    const [comments, setComments] = useState({})
    const [showCommentInput, setShowCommentInput] = useState({})
    const [images, setImages] = useState({})

    const router = useRouter()

    const getTypeOfTest = async () => {
        const { data } = await axios.get(`/api/type_of_test/${type_of_test_id}`)
        setTest(data)
    }

    const saveTest = async () => {
        const testEntriesChecks = test.testEntries.map(entry => ({
            testCheckName: entry.testCheckName,
            check: !!selectedChecks[entry.id],
            comment: comments[entry.id] || '',
            verifiedImage: images[entry.id] || null
        }))

        const data = {
            instrumentId,
            typeOfTestId: type_of_test_id,
            typeOfTestName: test.name,
            testEntriesChecks
        }

        try {
            console.log(data)
            // await axios.post('/api/tests', data)
            // router.push(`/instruments/${instrumentId}`)
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

    const handleCommentChange = (testEntryId, comment) => {
        setComments(prevState => ({
            ...prevState,
            [testEntryId]: comment
        }))
    }

    const toggleCommentInput = (testEntryId) => {
        setShowCommentInput(prevState => ({
            ...prevState,
            [testEntryId]: !prevState[testEntryId]
        }))
    }

    const handleImageUpload = (testEntryId, file) => {
        if (file) {
            setImages(prevState => ({
                ...prevState,
                [testEntryId]: file
            }))
        }
    }

    if (!test) return <Loading />

    return (
        <div className='min-h-screen flex justify-center items-center bg-gray-100 px-4'>
            <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-[400px]">
                <h2 className='text-2xl font-semibold text-center text-gray-800 mb-6'>{test.name}</h2>
                <ul className='space-y-6'>
                    {test.testEntries.map((entry, idx) => (
                        <li key={entry.id} className='bg-gray-50 p-4 rounded-lg shadow-sm'>
                            <div className='flex items-center justify-between'>
                                <label htmlFor={entry.id} className='text-gray-700 font-medium'>
                                    {idx + 1}. {entry.testCheckName}
                                </label>
                                <div className="flex items-center gap-2">
                                    <Checkbox id={entry.id} onCheckedChange={() => handleCheckboxChange(entry.id)}
                                        checked={!!selectedChecks[entry.id]} />
                                    <Button variant='ghost' size='sm' onClick={() => toggleCommentInput(entry.id)}>
                                        Comment
                                    </Button>
                                </div>
                            </div>
                            {showCommentInput[entry.id] && (
                                <Input
                                    value={comments[entry.id] || ''}
                                    onChange={(e) => handleCommentChange(entry.id, e.target.value)}
                                    placeholder="Type your comment here"
                                    className='mt-3 border rounded-md p-2 w-full'
                                />
                            )}
                            {entry.isVerifiedImageRequired && (
                                <div className="mt-3">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(entry.id, e.target.files[0])}
                                        className='border rounded-md p-2 w-full'
                                    />
                                    {images[entry.id] && (
                                        <p className='text-sm text-gray-500 mt-1'>Uploaded: {images[entry.id].name}</p>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                <Button onClick={saveTest} className='mt-6 w-full bg-[#FE5000] text-white hover:bg-[#e54900]'>Save</Button>
            </div>
        </div>
    )
}

export default Page
