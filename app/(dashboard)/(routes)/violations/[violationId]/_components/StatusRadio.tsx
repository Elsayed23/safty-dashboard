"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { FaCheck } from "react-icons/fa6";
import axios from "axios"
import { useAuth } from "@/app/context/AuthContext"

const FormSchema = z.object({
    status: z.enum(["red", "green", "yellow"], {
        required_error: "You need to select a notification type.",
    }),
})

const StatusRadioGroup = ({ defaultStatus, violation_id, toggleEdit, setViolationData }: { defaultStatus: string, violation_id: string, toggleEdit: any, setViolationData: any }) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    const { user } = useAuth()

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {

        const dataSend = {
            violation_id,
            status: values.status,
            user_id: user?.id
        }

        const { data } = await axios.patch('/api/violations/updateStatus', dataSend)

        const { updatedViolation } = data

        setViolationData(updatedViolation)
        toggleEdit()


        toast.success('Status changed')
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={defaultStatus}
                                    className="space-y-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="red" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Red
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="green" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Green
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="yellow" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Yellow</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" size='sm'>
                    Submit status
                </Button>
            </form>
        </Form>
    )
}


export default StatusRadioGroup