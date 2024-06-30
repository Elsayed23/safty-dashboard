'use client'
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
import { FaCheck, FaXmark } from "react-icons/fa6"
import { HiMiniXMark, HiXMark } from "react-icons/hi2"

const TestsTypeTabs = ({ id, testsData }) => {


    const tests = testsData?.map(({ typeOfTestName, testEntriesChecks, createdAt }, idx) => {
        return (
            <Dialog key={idx}>
                <DialogTrigger asChild>
                    <li className="cursor-pointer underline underline-offset-1">{typeOfTestName}</li>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]" dir="rtl">
                    <DialogHeader>
                        <DialogTitle>نتيجة الفحص</DialogTitle>
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
                        <p>تاريخ الإنشاء: {new Date(createdAt).toLocaleString('ar-EG')}</p>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    })

    console.log(testsData);

    return (
        <Tabs defaultValue="typesOfTests" dir="rtl" className="w-full sm:w-3/4 md:w-[540px] lg:w-[560px] sm:mx-4">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tests">الفحوصات</TabsTrigger>
                <TabsTrigger value="typesOfTests" defaultChecked={true}>انواع الفحوصات</TabsTrigger>
            </TabsList>
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
                                <h3>جميع الفحوصات</h3>
                                <ul className="list-decimal flex flex-col gap-2 self-start ps-10">
                                    {tests}
                                </ul>
                            </>
                            :
                            <h3>لا يوجد اي فحوصات مسبقة</h3>
                    }

                </Card>
            </TabsContent>
        </Tabs>
    )
}

export default TestsTypeTabs