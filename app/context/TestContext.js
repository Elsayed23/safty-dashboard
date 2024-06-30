'use client'
import React, { createContext, useContext, useState } from 'react';
import { instrumentsData, typeOfTestsData } from '../constants';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';

const TestContext = createContext();


export function useTests() {
    return useContext(TestContext);
}
export const TestProvider = ({ children }) => {

    const [typeOfTests, setTypeOfTests] = useState([])



    const handleGetTypeTest = async (id) => {
        const { data } = await axios.get(`/api/type_of_test?instrumentId=${id}`)
        setTypeOfTests(data)

    }

    const handleCreateTypeOfText = async (type_of_test_data) => {
        const { data } = await axios.post('/api/type_of_test', type_of_test_data)
        setTypeOfTests(prevTypeOfTests => {
            return [

                ...prevTypeOfTests,

                { ...data }
            ]
        })
    }


    return (
        <TestContext.Provider value={{ handleGetTypeTest, typeOfTests, setTypeOfTests, handleCreateTypeOfText }}>
            {children}
        </TestContext.Provider>
    );
};
