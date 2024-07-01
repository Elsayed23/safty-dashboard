'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

const InstrumentContext = createContext();

export const InstrumentProvider = ({ children }) => {

    const [instruments, setInstruments] = useState([])
    const [loading, setLoading] = useState(true)
    const [typesData, setTypesData] = useState([])
    const [instrumentType, setInstrumentType] = useState(null)

    const router = useRouter();

    const getInstruments = async () => {
        try {

            const { data } = await axios.get('/api/instruments')
            setInstruments(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false)
        }
    }

    const getInstrumentTypes = async () => {
        try {
            const { data } = await axios.get('/api/instrumentsTypes')
            setTypesData(data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleCreateInstrument = async (name) => {
        try {
            const { data } = await axios.post('/api/instruments', name)

            setInstruments(prevInstruments => {
                return [
                    ...prevInstruments,
                    data
                ]
            })
            toast.success('تم إنشاء المُعدة بنجاح!')
            router.push('/instruments')

        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteInstrument = async (id) => {
        setInstruments(prevData => prevData.filter((inst) => inst?.id != id))
        const { data } = await axios.delete('/api/instruments', {
            data: {
                id
            }
        })
        console.log(data);
        toast.success('تم حذف المُعدة بنجاح!')
        router.push('/instruments')
    }

    return (
        <InstrumentContext.Provider value={{ loading, instruments, setInstruments, getInstruments, handleCreateInstrument, handleDeleteInstrument, typesData, getInstrumentTypes, instrumentType, setInstrumentType }}>
            {children}
        </InstrumentContext.Provider>
    );
};

export const useInstrument = () => useContext(InstrumentContext);
