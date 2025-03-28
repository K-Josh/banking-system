"use client"
import React from 'react'
import {
    FormControl,
    FormDescription,
    FormField,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
import { Control, FieldPath } from 'react-hook-form'
import { z } from 'zod'
import { authFormSchema } from '@/lib/utils'

// i passed in a specific type cuz we want to use all of the fields
const formSchema = authFormSchema('sign-up')

interface customInput {
    control: Control<z.infer<typeof formSchema>>,
    name: FieldPath<z.infer<typeof formSchema>>,
    label: string,
    placeholder: string,
}

const CustomInput = ({ control, name, label, placeholder}: customInput) => {

  return (
             <FormField
                control={control}
                name={name}
                render={({ field }) => (
                 <div className='form-item'>
                  <FormLabel>{label}</FormLabel>
                    <div className='flex w-full flex-col'>
                       <FormControl>
                         <Input
                            placeholder={placeholder} 
                            {...field} 
                            type={name === 'password' ? 'password' : 'text'} 
                            className='input-class text-gray-500 ' />
                        </FormControl>
                     <FormMessage className='form-message mt-3'/>
                   </div>
                 </div>
                )}
                />
               
  )
}

export default CustomInput
