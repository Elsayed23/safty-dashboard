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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from 'axios';
import { toast } from 'sonner';

// Define the schema for the form inputs
const formSchema = z.object({
    title: z.string().min(1, 'You must add a job title Name field'),
});

// Define the interface for form values based on the schema
interface FormValues {
    title: string;
}

const AddJobTitle = ({ setData }: { setData: any }) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',

        },
    });


    const onSubmit = async (values: FormValues) => {
        try {
            const { data } = await axios.post('/api/job_title', values)
            setData(data);
            toast.success('The job title was added')

        } catch (error) {
            console.log(error);
        }
    };


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" className='flex bg-[#FE5000] hover:bg-[#fe5000e1] items-center self-start gap-1'>Add job title</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle >Add job title</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job title name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Job Title..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogClose asChild>
                            <Button type="submit">save</Button>
                        </DialogClose>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddJobTitle;
