'use client';
import {
    Card,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import TestsTypeSelect from "./TestsTypeSelect"
import CreateTestType from './CreateTestType'
import axios from "axios"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FaCheck, FaDownload, FaXmark } from "react-icons/fa6"
import { HiMiniXMark, HiXMark } from "react-icons/hi2"
import Link from "next/link"
import Slider from "../../../../_components/ImagesSlider";
import { useTests } from "@/app/context/TestContext"
import { Input } from "@/components/ui/input";

const TestsTypeTabs = ({ id, testsData, instrumentData, instrumentId }) => {
    const [files, setFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileNames, setFileNames] = useState({});

    useEffect(() => {
        // Fetch files for the specific instrument
        const fetchFiles = async () => {
            try {
                const response = await axios.get(`/api/instruments/${instrumentId}/files`);
                setUploadedFiles(response.data.files);
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        };
        fetchFiles();
    }, [instrumentId]);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(selectedFiles);

        const previews = selectedFiles.map(file => ({
            name: file.name,
            url: URL.createObjectURL(file)
        }));
        setFilePreviews(previews);

        const names = {};
        selectedFiles.forEach(file => {
            names[file.name] = file.name.split('.')[0]; // default name without extension
        });
        setFileNames(names);
    };

    const handleNameChange = (event, fileName) => {
        const newNames = { ...fileNames, [fileName]: event.target.value };
        setFileNames(newNames);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('instrumentId', instrumentId);
        files.forEach(file => {
            formData.append('files', file);
            formData.append('fileNames', fileNames[file.name]);
        });

        try {
            const response = await axios.post('/api/instruments/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.status === 200) {
                const newUploadedFiles = files.map(file => ({
                    name: fileNames[file.name],
                    path: URL.createObjectURL(file),
                }));
                setUploadedFiles([...uploadedFiles, ...newUploadedFiles]);
                setFiles([]);
                setFilePreviews([]);
                alert('Files uploaded successfully');
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const tests = testsData?.map(({ typeOfTestName, testEntriesChecks, createdAt }, idx) => {
        return (
            <Dialog key={idx}>
                <DialogTrigger asChild>
                    <li className="cursor-pointer underline underline-offset-1">{typeOfTestName}</li>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]" dir="rtl">
                    <DialogHeader>
                        <DialogTitle>Inspection result</DialogTitle>
                    </DialogHeader>
                    <ul className="flex flex-col gap-2 list-decimal px-4">
                        {
                            testEntriesChecks?.map((check, idx) => {
                                return (
                                    <li key={idx} className="flex items-center justify-between gap-3 border-t border-b px-1 py-2">{check.testCheckName} {String(check.check) === 'true' ? <FaCheck size={19} /> : <FaXmark size={20} />}</li>
                                )
                            })
                        }
                    </ul>
                    <DialogFooter className="sm:justify-start">
                        <p>Date created: {new Date(createdAt).toLocaleString('en-US')}</p>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    });

    const { handleDeleteInstrument } = useTests();

    return (
        <Tabs defaultValue="info" className="w-full sm:w-3/4 md:w-[540px] lg:w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="info" defaultChecked={true}>Information</TabsTrigger>
                <TabsTrigger value="typesOfTests" >Inspection types</TabsTrigger>
                <TabsTrigger value="tests">Inspection</TabsTrigger>
                <TabsTrigger value="vut">VUT</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
                <Card className="py-3 flex flex-col">
                    <div className="flex items-center min-h-[calc(100vh-234px)] flex-col gap-5 py-5 px-4">
                        <div className="flex flex-col items-center gap-4 ">
                            <h2 className='text-xl font-semibold'> {instrumentData?.name} </h2>
                            <h3 className='text-lg font-semibold text-slate-900'>Instrument type: {instrumentData?.type?.name} </h3>
                            <span className='text-sm'>Added date: {new Date(instrumentData?.createdAt).toLocaleString('en-US')}</span>
                            <div className="flex items-center gap-9">
                                <Link href='#tests' className='text-sm underline text-sky-900'>go to inspections</Link>
                                <Button variant='destructive' onClick={async () => await handleDeleteInstrument(instrumentId)}>Remove instrument</Button>
                            </div>
                        </div>
                        <Slider images={instrumentData?.images} />
                    </div>
                </Card>
            </TabsContent>
            <TabsContent value="typesOfTests">
                <Card className="flex flex-col items-center gap-9 py-3">
                    <TestsTypeSelect instrumentID={id} />
                    <CreateTestType id={id} />
                </Card>
            </TabsContent>
            <TabsContent value="tests">
                <Card className="flex flex-col items-center gap-4 py-3">
                    <TestsTypeSelect instrumentID={id} test_tab={true} />
                    {
                        testsData?.length
                            ?
                            <>
                                <h3>All Inspections</h3>
                                <ul className="list-decimal flex flex-col gap-2 self-start ps-10">
                                    {tests}
                                </ul>
                            </>
                            :
                            <h3>There is no Inspection yet</h3>
                    }

                </Card>
            </TabsContent>
            <TabsContent value="vut">
                <Card className="flex flex-col items-center gap-4 py-3">
                    <div className="flex flex-col gap-5 px-4">
                        <div className="flex flex-col gap-4 ">
                            <h1 className="text-4xl font-bold py-4">Files</h1>
                            <input type="file" multiple onChange={handleFileChange} />
                            {filePreviews.map((file, index) => (
                                <div key={index} className="mr-4 mb-4">
                                    <div className="flex flex-col items-center">
                                        <span>{file.name}</span>
                                    </div>
                                </div>
                            ))}
                            <Button onClick={handleUpload}>Upload Files</Button>
                            <div className="flex flex-col gap-2 mt-4">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index}>
                                        <div className="flex items-center gap-2">
                                            <span>{file.name}</span>
                                            {file.path && <a href={file.path} download={file.name}><FaDownload size={25} /></a>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            </TabsContent>
        </Tabs>
    )
}

export default TestsTypeTabs;
