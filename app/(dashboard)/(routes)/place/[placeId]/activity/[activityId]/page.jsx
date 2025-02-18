'use client';
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import Loading from '@/app/(dashboard)/_components/Loading';
import { FileUpload } from '@/app/(dashboard)/_components/FileUpload'
import { useAuth } from '@/app/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Page = ({ params: { placeId, activityId } }) => {

    const [activityTypeData, setActivityTypeData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [assessments, setAssessments] = useState([])

    const { user } = useAuth()

    const fetchActivity = async () => {
        try {

            const { data } = await axios.get(`/api/places/${placeId}/activity/${activityId}`)
            const { riskAssessments } = data
            setAssessments(riskAssessments)
            setActivityTypeData(data)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    const handleFileUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', user.id)

            await axios.post(`/api/places/${placeId}/activity/${activityId}/risk-assessment`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchActivity();
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    const handleApproval = async (assessmentId, status) => {
        try {
            await axios.put(`/api/risk-assessments/${assessmentId}/approve`, { status, userId: user.id });
            fetchActivity();
        } catch (error) {
            console.error('Approval failed:', error);
        }
    };

    console.log(activityTypeData);

    useEffect(() => {
        fetchActivity()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="p-6">
            <h1 className='text-center text-2xl font-semibold'>{activityTypeData.name}</h1>
            <h1 className="text-2xl font-bold mb-6">Permit to Work</h1>
            <Tabs defaultValue="risk-assessment" className="w-full">
                {/* Tabs List */}
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="risk-assessment">Risk assessment</TabsTrigger>
                    <TabsTrigger value="permit-to-work">Permit to work</TabsTrigger>
                    <TabsTrigger value="personeel">Personeel</TabsTrigger>
                    <TabsTrigger value="inspection">Inspection</TabsTrigger>
                </TabsList>

                {/* Tab Content */}
                <TabsContent value="risk-assessment" className="mt-4">
                    <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Risk Assessment</h2>
                            <FileUpload
                                acceptedFileTypes={['.doc', '.docx']}
                                onFileUpload={handleFileUpload}
                            />
                        </div>

                        <div className="space-y-4">
                            {assessments.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">
                                    No risk assessments uploaded yet
                                </div>
                            ) : (
                                assessments.map((assessment) => (
                                    <div key={assessment.id} className="border p-4 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <a
                                                    href={assessment.filePath}
                                                    download
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {assessment.fileName}
                                                </a>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Uploaded by {assessment.uploader.name} •{' '}
                                                    {new Date(assessment.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={
                                                        assessment.status === 'APPROVED' ? 'success' :
                                                            assessment.status === 'REJECTED' ? 'destructive' : 'warning'
                                                    }
                                                >
                                                    {assessment.status}
                                                </Badge>

                                                {user.id !== assessment.uploaderId && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleApproval(assessment.id, 'APPROVED')}
                                                            disabled={assessment.status !== 'PENDING'}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleApproval(assessment.id, 'REJECTED')}
                                                            disabled={assessment.status !== 'PENDING'}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {assessment.approver && (
                                            <p className="text-sm mt-2 text-gray-500">
                                                {assessment.status} by {assessment.approver.name} •{' '}
                                                {new Date(assessment.updatedAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="permit-to-work" className="mt-4">
                    <Tabs defaultValue="hot-work" className="w-full">
                        {/* Tabs List */}
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="hot-work">Hot Work PTW</TabsTrigger>
                            <TabsTrigger value="confined-space">Confined Space</TabsTrigger>
                            <TabsTrigger value="excavation">Excavation</TabsTrigger>
                            <TabsTrigger value="work-at-height">Work at Height</TabsTrigger>
                            <TabsTrigger value="lifting-work">Lifting Work</TabsTrigger>
                        </TabsList>

                        {/* Tab Content */}
                        <TabsContent value="hot-work" className="mt-4">
                            <div className="p-4 border rounded-lg">
                                <h2 className="text-xl font-semibold">Hot Work PTW</h2>
                                <p className="mt-2">Content for Hot Work Permit to Work.</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="confined-space" className="mt-4">
                            <div className="p-4 border rounded-lg">
                                <h2 className="text-xl font-semibold">Confined Space</h2>
                                <p className="mt-2">Content for Confined Space Permit to Work.</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="excavation" className="mt-4">
                            <div className="p-4 border rounded-lg">
                                <h2 className="text-xl font-semibold">Excavation</h2>
                                <p className="mt-2">Content for Excavation Permit to Work.</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="work-at-height" className="mt-4">
                            <div className="p-4 border rounded-lg">
                                <h2 className="text-xl font-semibold">Work at Height</h2>
                                <p className="mt-2">Content for Work at Height Permit to Work.</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="lifting-work" className="mt-4">
                            <div className="p-4 border rounded-lg">
                                <h2 className="text-xl font-semibold">Lifting Work</h2>
                                <p className="mt-2">Content for Lifting Work Permit to Work.</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </TabsContent>

                <TabsContent value="personeel" className="mt-4">
                    <div className="p-4 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Personeel</h2>
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Team Members</h3>
                            <p>List of personnel involved in the activity.</p>
                            <h3 className="text-lg font-medium">Roles and Responsibilities</h3>
                            <p>Define the roles and responsibilities of each team member.</p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="inspection" className="mt-4">
                    <div className="p-4 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Inspection</h2>
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Pre-Activity Inspection</h3>
                            <p>Checklist for pre-activity safety inspections.</p>
                            <h3 className="text-lg font-medium">Post-Activity Inspection</h3>
                            <p>Checklist for post-activity safety inspections.</p>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Page;