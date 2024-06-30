'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from '@/components/ui/checkbox';
import { useTests } from '@/app/context/TestContext';
import { useRouter } from 'next/navigation';

// Define the schema for the form inputs
const formSchema = z.object({
    typeOfTestName: z.string().min(1, 'عليك إضافة حقل اسم نوع الفحص ي هندسة'),
    testCheckName: z.string().min(0, 'Please enter at least one character.'),
});

// Define the interface for form values based on the schema
interface FormValues {
    typeOfTestName: string;
    testCheckName: string;
}

const CreateTestType = ({ id }: { id: string }) => {

    const [testEntries, setTestEntries] = useState<FormValues[]>([]);

    const [isAddTypeOfText, setIsAddTypeOfText] = useState(false)

    const { handleCreateTypeOfText } = useTests()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            typeOfTestName: '',
            testCheckName: "",
        },
    });

    const { register, handleSubmit, reset } = form;

    const onSubmitMainTestName = handleSubmit(({ typeOfTestName }: FormValues) => {
        handleCreateTypeOfText({
            name: typeOfTestName,
            testEntries,
            instrumentId: id
        });
        reset({ ...form.getValues(), testCheckName: '', typeOfTestName: '' });
        setIsAddTypeOfText(false)
        setTestEntries([])
    });

    const onSubmitTestChecked = handleSubmit((data: FormValues) => {
        setTestEntries(prev => [...prev, data]);
        reset({ ...form.getValues(), testCheckName: '' });
        setIsAddTypeOfText(false)
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className=''>إنشاء نوع فحص</Button>
            </DialogTrigger>
            <DialogContent dir='rtl' className="sm:max-w-[425px]">
                <DialogHeader className='flex-row-reverse'>
                    <DialogTitle>إنشاء نوع فحص</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={onSubmitMainTestName} id='test' className="space-y-5">
                        <FormItem>
                            <FormLabel>إسم نوع الفحص</FormLabel>
                            <FormControl>
                                <Input {...register("typeOfTestName")} placeholder="اسم نوع الفحص..." />
                            </FormControl>
                        </FormItem>
                    </form>

                    <form onSubmit={onSubmitTestChecked} className='space-y-4'>
                        <FormItem>
                            <FormLabel>إسم الفحص المراد التأكد منه</FormLabel>
                            <div className="flex items-center gap-3">
                                <FormControl>
                                    <Input {...register("testCheckName")} placeholder="اسم الفحص..." />
                                </FormControl>
                            </div>
                        </FormItem>
                        <Button type="submit">حفظ الفحص</Button>
                    </form>

                    <ul>
                        {testEntries.map((entry, index) => (
                            <li key={index}>{`${entry.testCheckName}`}</li>
                        ))}
                    </ul>
                    <Button type="submit" form='test' className='w-full'>حفظ</Button>

                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTestType;
