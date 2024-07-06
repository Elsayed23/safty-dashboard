'use client'
import Loading from '@/app/(dashboard)/_components/Loading'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Slider from '../../../_components/ImagesSlider'
import { FaPenToSquare } from "react-icons/fa6";
import StatusRadioGroup from './_components/StatusRadio'
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useAuth } from '@/app/context/AuthContext'
import CommentCard from './_components/CommentCard'

const FormSchema = z.object({
  comment: z
    .string()
    .min(5, {
      message: "comment must be at least 5 characters.",
    }),
})
const page = ({ params: { violationId } }: { params: { violationId: string } }) => {

  const [violationData, setViolationData] = useState<any>(null)
  const [isEditStatus, setIsEditStatus] = useState(false)
  const [comments, setComments] = useState<any[] | null>(null)

  const toggleEdit = () => setIsEditStatus(prev => !prev)

  const { user } = useAuth()

  const getViolation = async () => {
    try {
      const { data } = await axios.get(`/api/violations/${violationId}`)
      setViolationData(data)
    } catch (error) {
      console.log(error);
    }
  }

  const getComments = async () => {
    try {
      const { data } = await axios.get(`/api/violations/comments/?violation_id=${violationId}`)
      setComments(data)
    } catch (error) {
      console.log(error);

    }
  }
  console.log(comments);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  useEffect(() => {
    getViolation()
    getComments()
  }, [])


  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const dataSend = {
        violation_id: violationId,
        comment: values.comment,
        commentedBy: user?.id
      }

      await axios.post('/api/violations/comments', dataSend)
      form.reset({ ...form.getValues(), comment: '' });

      toast.success('Commented')
    } catch (error) {
      console.log(error);

    }

  }

  const commentList = comments?.length === 0 ? (
    <p className="text-gray-600">No comments available.</p>
  ) : (
    <ul className="space-y-4 mb-6">
      {comments?.map((comment, idx) => (
        <CommentCard key={idx} {...comment} />
      ))}
    </ul>
  );

  if (!violationData) {
    return <Loading isFull={false} />
  }


  return (
    <div className="flex items-center min-h-[calc(100vh-80px)] flex-col gap-5 py-12 px-4">
      <h1 className='text-4xl font-semibold mb-12'>Violation details</h1>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-2 border px-6 py-4 rounded-md">
          <Image src={violationData?.user?.user_photo} alt='user_photo' width={128} height={128} className='w-32 h-32 rounded-full border' />
          <h2>{violationData?.user?.name} | {violationData?.user?.job_title?.title}</h2>
        </div>
        <h2 className='text-xl font-semibold'> {violationData?.name} </h2>
        <p className='font-medium text-slate-900 max-w-lg'><span className='font-semibold'>Description</span>: {violationData?.description} </p>
        {
          isEditStatus
            ?
            <StatusRadioGroup violation_id={violationId} setViolationData={setViolationData} defaultStatus={violationData?.status} toggleEdit={toggleEdit} />
            :
            <span className='text-sm flex items-center gap-2'>Status: {violationData?.status} <FaPenToSquare onClick={toggleEdit} size={20} className='cursor-pointer hover:text-[#ec7831] duration-200' /></span>

        }
        <div className="flex items-center gap-9">
          {/* <Button variant='destructive' onClick={async () => await handleDeleteInstrument(instrumentId)}>Remove instrument</Button> */}
        </div>
      </div>
      <Slider images={violationData?.images} />
      <div className="self-start py-6 w-full">
        <div className="flex flex-col gap-4">
          <h1 className='text-3xl font-semibold'>Comments</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your comment</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Leave your comment"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Send</Button>
            </form>
          </Form>
        </div>
        {commentList}
      </div>
    </div>
  )
}

export default page