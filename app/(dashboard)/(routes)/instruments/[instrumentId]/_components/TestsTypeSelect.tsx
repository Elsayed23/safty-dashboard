"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTests } from "@/app/context/TestContext"
import ShowData from './ShowTypeOfTestData'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const FormSchema = z.object({
  typeOfTest: z
    .string({
      required_error: "Please select an type of inspection.",
    })
})



const TestsTypeSelect = ({ instrumentID, test_tab }: { instrumentID: string; test_tab: boolean }) => {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const [checksData, setChecksData] = useState<[]>([])



  const router = useRouter()

  const { isValid } = form.formState

  const { typeOfTests, handleGetTypeTest } = useTests()



  const getTypeOfTestsData = async () => {
    await handleGetTypeTest(instrumentID)

  }
  useEffect(() => {
    getTypeOfTestsData()
  }, [])

  const onSubmit = (data: z.infer<typeof FormSchema>) => {

    if (test_tab) {
      router.push(`/instruments/${instrumentID}/test/${data.typeOfTest}`)
    } else {
      const checksData = typeOfTests?.filter(
        ({ id }: { id: string }) => id === data?.typeOfTest
      )[0].testEntries
      setChecksData(checksData);
    }


  }

  const typesOfTestsItem = typeOfTests?.map(({ id, name }: { id: string; name: string }, idx: number) => {
    return (
      <SelectItem key={idx} value={String(id)}>{name}</SelectItem>
    )
  })

  return (
    typeOfTests?.length
      ?
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row gap-3 w-full px-2 sm:px-5">
          <FormField
            control={form.control}
            name="typeOfTest"
            render={({ field }) => (
              <FormItem className="w-full">
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select inspection type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {typesOfTestsItem}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          {
            test_tab
              ?
              <Button disabled={!isValid}>Create inspection</Button>
              :
              <ShowData isValid={isValid} checksData={checksData} />
          }
        </form>
      </Form>
      :
      <h3 className="text-center font-semibold">There are no any types of inspections</h3>
  )
}

export default TestsTypeSelect