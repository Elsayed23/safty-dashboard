'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import GeneralDataForm from './GeneralDataForm';
import { Pencil, X } from "lucide-react";

const GeneralDataComponent = () => {
    const [generalData, setGeneralData] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedField, setSelectedField] = useState(null);
    const [selectedData, setSelectedData] = useState(null);

    useEffect(() => {
        fetchGeneralData();
    }, []);

    const fetchGeneralData = async () => {
        try {
            const { data } = await axios.get('/api/general_data');
            setGeneralData(data[0]);
        } catch (error) {
            console.error('Error fetching general data:', error);
        }
    };

    const handleAddClick = () => {
        setSelectedField('all');
        setSelectedData({});
        setIsFormVisible(prev => !prev);
    };

    const handleEditClick = (field) => {
        setSelectedField(field);
        setSelectedData(generalData);
        setIsFormVisible(true);
    };

    const handleCancelClick = () => {
        setIsFormVisible(false);
        setSelectedField(null);
        setSelectedData(null);
    };

    return (
        <div className='flex flex-col gap-4 mb-5'>
            <h1>General Data</h1>
            {generalData ? (
                <div>
                    <div className="flex items-center gap-3">
                        <span>{generalData.name}</span>
                        {isFormVisible && selectedField === 'name' ? (
                            <Button variant="ghost" onClick={handleCancelClick}>
                                <X className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button variant="ghost" onClick={() => handleEditClick('name')}>
                                <Pencil className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center">
                        <span>Supervisor: {generalData.supervisor.name}</span>
                        {isFormVisible && selectedField === 'supervisorId' ? (
                            <Button variant="ghost" onClick={handleCancelClick}>
                                <X className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button variant="ghost" onClick={() => handleEditClick('supervisorId')}>
                                <Pencil className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center">
                        <span>Site Manager: {generalData.siteManager.name}</span>
                        {isFormVisible && selectedField === 'siteManagerId' ? (
                            <Button variant="ghost" onClick={handleCancelClick}>
                                <X className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button variant="ghost" onClick={() => handleEditClick('siteManagerId')}>
                                <Pencil className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <Button onClick={handleAddClick} className={`${isFormVisible && 'bg-red-600 hover:bg-red-500'}`}>
                    {
                        !isFormVisible
                            ?
                            'Add General Data'
                            :
                            'Cancel'
                    }

                </Button>
            )}
            {isFormVisible && (
                <GeneralDataForm
                    data={selectedData}
                    field={selectedField}
                    onClose={handleCancelClick}
                    onRefresh={fetchGeneralData}
                />
            )}
        </div>
    );
};

export default GeneralDataComponent;
