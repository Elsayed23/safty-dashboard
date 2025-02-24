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
import { FaCheck } from 'react-icons/fa6';
import { Label } from '@/components/ui/label';

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

const CreateTestType = ({ instrumentId, instrumentTypeId }: { instrumentId: any, instrumentTypeId: any }) => {

    const [testEntries, setTestEntries] = useState<FormValues[]>([]);

    const [isAddTypeOfText, setIsAddTypeOfText] = useState(false)

    const { handleCreateTypeOfText } = useTests()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            typeOfTestName: '',
            testCheckName: '',
        },
    });

    const { register, handleSubmit, setValue, watch, reset } = form;



    const onSubmitMainTestName = handleSubmit(({ typeOfTestName }: FormValues) => {
        handleCreateTypeOfText({
            name: typeOfTestName,
            testEntries,
            instrumentId,
            instrumentTypeId
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
                <Button variant="outline" className=''>Create a inspection form</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create a inspection form</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={onSubmitMainTestName} id='test' className="space-y-5">
                        <FormItem>
                            <FormLabel>Name of the inspection type</FormLabel>
                            <FormControl>
                                <Input {...register("typeOfTestName")} placeholder="type of test name..." />
                            </FormControl>
                        </FormItem>
                    </form>

                    <form onSubmit={onSubmitTestChecked} className='flex flex-col gap-2'>
                        <Label>The name of the inspection to be verified</Label>
                        <div className='flex items-center gap-2'>
                            <FormControl>
                                <Input {...register("testCheckName")} placeholder="check name..." />
                            </FormControl>
                            <Button type="submit" size='icon'>
                                <FaCheck size={18} />
                            </Button>
                        </div>
                    </form>

                    <ul className='list-disc p-[revert]'>
                        {testEntries.map((entry, index) => (
                            <li key={index}>{`${entry.testCheckName}`}</li>
                        ))}
                    </ul>
                    <DialogClose>
                        <Button type="submit" form='test' className='w-full'>Save</Button>
                    </DialogClose>

                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTestType;
