'use client'
import React, { useEffect, useState } from 'react'
import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Check, ChevronsUpDown } from "lucide-react"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Pencil } from 'lucide-react'
import toast from 'sonner'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTests } from '@/app/context/TestContext'

interface TypeData {
    id: string;
    name: string;
}


const formSchema = z.object({
    name: z.string().min(1, {
        message: "name is required"
    }),
    typeId: z.string().min(1)
})

const Page = () => {
    const router = useRouter()
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    const form = useForm < z.infer < typeof formSchema >> ({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            typeId: value
        }
    })

    const { handleCreateInstrument } = useTests()
    const { isSubmitting, isValid } = form.formState

    const [typesData, setTypesData] = useState < TypeData[] > ([])

    const getTypes = async () => {
        const { data } = await axios.get('/api/instrumentsTypes')
        setTypesData(data)
    }

    useEffect(() => {
        getTypes()
    }, [])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // await handleCreateInstrument(values);
        console.log(values

        );

    }

    return (
        <div className="flex justify-center items-center  h-[calc(100vh-80px)]">
            <div className='mb-6 border bg-slate-100 rounded-md p-4 max-w-lg w-full mx-auto'>
                <div className='font-medium mb-4 flex items-center justify-between'>
                    Instrument type
                </div>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[260px] justify-between"
                        >
                            test
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                </Popover>
                <div className='font-medium mt-6 flex items-center justify-between'>
                    Instrument name
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'جرااااااف'"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className='flex justify-between items-center gap-2'>
                            <Button
                                type='submit'
                            >
                                Save
                            </Button>
                            <Button onClick={() => { router.push('/instruments') }} variant='destructive'>إلغاء</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Page
