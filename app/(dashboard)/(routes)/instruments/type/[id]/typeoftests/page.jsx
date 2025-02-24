'use client'
import React, { useEffect, useState } from 'react'
import CreateTestType from '../../../[instrumentId]/_components/CreateTestType'
import { useAuth } from '@/app/context/AuthContext'
import axios from 'axios'
import TestsTypeSelect from '../../../[instrumentId]/_components/TestsTypeSelect'

const Page = ({ params: { id } }) => {
  const { user } = useAuth()
  const [typeOfTests, setTypeOfTests] = useState([])

  useEffect(() => {
    const fetchTypeOfTests = async () => {
      try {
        const { data } = await axios.get(`/api/type_of_test?instrumentTypeId=${id}`)

        setTypeOfTests(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchTypeOfTests()
  }, [id])

  return (
    <div className='p-6'>
      {user?.role?.name === 'Admin' || user?.role?.name === 'Engineer' ? (
        <>
          <CreateTestType instrumentTypeId={id} />
          <h2 className="text-xl font-semibold mt-4 mb-2">type of tests of this instrument type: </h2>
          <TestsTypeSelect instrumentTypeID={id} test_tab={false} />
        </>
      ) : (
        <p>غير مصرح لك بعرض هذه الصفحة</p>
      )}
    </div>
  )
}

export default Page

//  <TestsTypeSelect instrumentID={id} test_tab={true} />