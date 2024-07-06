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
import { useTests } from '@/app/context/TestContext';
import { CirclePlus } from 'lucide-react';
import axios from 'axios';
import { useInstrument } from '@/app/context/InstrumentContext';
import { FaRegCircleXmark } from 'react-icons/fa6';

// Define the schema for the form inputs
const formSchema = z.object({
    name: z.string().min(1, 'Please enter at least one character.'),
});

// Define the interface for form values based on the schema
interface FormValues {
    name: string;
}

const CreateTypeModal = () => {


    const { getInstrumentTypes } = useInstrument()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        },
    });


    const { register, handleSubmit } = form;

    const onSubmitMainTestName = handleSubmit(async ({ name }: FormValues) => {
        try {
            await axios.post('/api/instrumentsTypes', { name })
            getInstrumentTypes()

        } catch (error) {
            console.log(error);
        }
    });


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='bg-transparent border-[#FE5000] text-[#FE5000] uppercase ml-10 flex items-center gap-2 hover:bg-transparent'>Add type  <CirclePlus size={18} /></Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className='flex items-center justify-between'>
                    <DialogTitle>Create instrument type</DialogTitle>

                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={onSubmitMainTestName} id='test' className="space-y-5">
                        <FormItem>
                            <FormLabel>Name of type</FormLabel>
                            <FormControl>
                                <Input {...register("name")} placeholder="type name..." />
                            </FormControl>
                        </FormItem>
                    </form>
                    <DialogClose>
                        <Button type="submit" form='test' className='w-full'>Save</Button>
                    </DialogClose>

                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTypeModal;
