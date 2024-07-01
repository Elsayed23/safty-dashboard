'use client'
import React, { useEffect, useState } from 'react'
import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Check, ChevronsUpDown, CirclePlus } from "lucide-react"

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
import { useInstrument } from '@/app/context/InstrumentContext'
import CreateTypeModal from './CreateTypeModal'


const formSchema = z.object({
    typeId: z.string().min(1)
})

const Page = () => {

    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            typeId: value
        }
    })

    const { typesData, getInstrumentTypes, instrumentType, setInstrumentType, setInstruments, instruments } = useInstrument()

    const handleGetTypes = async (id: string) => {
        const { data } = await axios.get(`/api/instrumentsTypes/${id}`)
        setInstruments(data)
    }

    console.log(instruments);


    const types = typesData?.map(({ name, id }: { name: string; id: string }, idx: number) => {
        return (
            <li key={idx} onClick={() => handleGetTypes(id)} className={`py-2 pl-6 cursor-pointer w-full ${instrumentType === id && 'bg-black bg-opacity-10'} rounded-sm hover:bg-black hover:bg-opacity-10 duration-200`}>
                {name}
            </li>
        )
    })

    useEffect(() => {
        getInstrumentTypes()
    }, [])


    return (
        <div>
            <ul className="flex flex-col gap-4 p-4">
                {types}
            </ul>
            <CreateTypeModal />
        </div>
    )
}

export default Page
