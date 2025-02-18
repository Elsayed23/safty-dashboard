'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Input
} from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Place name is required"
    })
});


const page = ({
    params: { placeId }
}: { params: { placeId: string } }) => {

    const searchParams = useSearchParams()
    const placeName = searchParams.get('place_name')


    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        }
    });

    const { isSubmitting, isValid } = form.formState;


    const onSubmit = async ({ name }: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/places/${placeId}/activity`, {
                name
            });

            toast.success('Place added successfully')
            router.push(`/place/${placeId}`);


        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
            <div className='mb-6 border bg-slate-100 rounded-md p-4 max-w-lg w-full mx-auto'>
                {placeName && <h3 className='text-center text-2xl font-medium'>Add activity in {placeName}</h3>}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                        <Label className='mb-4' htmlFor='name'>Activity name</Label>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            className='mb-5'
                                            id='name'
                                            disabled={isSubmitting}
                                            placeholder="activity name..."
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className='flex justify-between items-center gap-2 mt-4'>
                            <Button onClick={() => { router.push(`/place/${placeId}`) }} variant='destructive'>Cancel</Button>
                            <Button
                                type='submit'
                                disabled={isSubmitting || !isValid}
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default page