'use client'
import * as React from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import axios from "axios";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { cn } from "@/lib/utils";

// Define the schema for the form inputs
const formSchema = z.object({
    training_id: z.string(),
    user_id: z.string(),
    instructor_id: z.string().optional()
});

// Define the interface for form values based on the schema
interface FormValues {
    training_id: string;
    user_id: string;
    instructor_id: string
}
type AddTrainingModalProps = {
    isOpen: boolean;
    onClose: () => void;
    user_id: string
};
const AddTraninings: React.FC<AddTrainingModalProps> = ({ isOpen, onClose, user_id }) => {

    const { user } = useAuth()


    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            training_id: "",
            user_id: '',
            instructor_id: user?.id
        },
    });

    const [traninings, setTraninings] = React.useState<any[] | null>(null)

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const getTrainings = async () => {
        try {
            const { data } = await axios.get('/api/trainings')
            setTraninings(data)
        } catch (error) {
            console.log(error);
        }
    }

    React.useEffect(() => {
        getTrainings()
    }, [])


    const onSubmit = async (values: FormValues) => {

        const { data } = await axios.post('/api/add_trainings', { ...values, user_id: user_id })
        console.log(data);

    };


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle >Add Training</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
                                >
                                    {value
                                        ? traninings?.find((type: any) => type.id === value)?.name
                                        : "select job title..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput
                                        onChangeCapture={(e) => {
                                            console.log(e);
                                        }} placeholder="Search about job title..." />
                                    <CommandList>
                                        <CommandEmpty>No job titles found.</CommandEmpty>
                                        <CommandGroup>
                                            {traninings?.map((type: any) => (
                                                <CommandItem
                                                    key={type.id}
                                                    value={type.id}
                                                    className="text-black"
                                                    onSelect={(currentValue: any) => {
                                                        setValue(currentValue === value ? "" : currentValue);
                                                        form.setValue('training_id', currentValue === value ? "" : currentValue);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            value === type.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {type.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <DialogClose asChild>
                            <Button type="submit">save</Button>
                        </DialogClose>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddTraninings;
