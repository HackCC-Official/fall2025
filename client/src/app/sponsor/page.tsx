'use client'

import Nav  from "../../components/sponser/nav"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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
import { Textarea } from "@/components/ui/textarea"

import { Input } from "@/components/ui/input"
import { useState } from "react"

const formSchema = z.object({
  fname: z.string().min(2,{
    message: "Name must be at least between 2 - 50 characters.",
  }).max(50),
  company: z.string().min(1,{
    message: "Company Name must be between 1 - 50 characters"
  }).max(50),
  email: z.string().min(2,{
    message: "Must be a valid email"
  }).max(50),
  inquiry: z.string().min(2,{
    message: "Inquiry muist be between 50 - 400 characters"
  }).max(400),
})

export default function SponsorPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          fname: "",
          company: "",
          email: "",
          inquiry: "",
        }
      })
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }
    const text ="HackCC wouldn’t be possible without the support of our incredible sponsors. As the first hackathon created by and for California Community College students, we’re dedicated to fostering innovation, accessibility, and career opportunities for aspiring developers. With your support, we can empower the next generation of tech talent and scale innovation like never before!"


    return(
        <main className="bg-white overflow-hidden">
            <div className="flex flex-wrap bg-white w-screen h-auto">
                <Nav></Nav>
                <div className="flex flex-wrap md:flex-nowrap md:gap-x-10 mx-auto mt-24 md:mt-40 w-[90%] lg:w-[80%] min-w-[200px] max-w-[1600px] h-auto">
                    <div className="h-auto font-mont text-black md:basis-1/2">
                        <h1 className="mb-4 font-bagel text-hoverpurple text-2xl sm:text-3xl md:text-4xl 2xl:text-6xl">Sponsor Us</h1>
                        <h2 className="text-hoverpurple text-base sm:text-lg md:text-2xl 2xl:text-3xl">Hey there!</h2>
                        <p className="my-2 text-xs md:text-base 2xl:text-lg">{text}</p>
                        <h1 className="text-hoverpurple text-base sm:text-lg md:text-2xl 2xl:text-3xl">As a sponsor, you'll be able to:</h1>
                        <ul className="my-2 pl-6 text-xs md:text-base 2xl:text-lg list-disc">
                            <li>Support ambitious students from underserved backgrounds with career-defining opportunities</li>
                            <li>Introduce your product, platform, or API to a diverse group of student developers</li>
                            <li>Increase your brand’s visibility through HackCC’s marketing and social medias</li>
                        </ul>
                        <p className="mt-6 font-black text-xs md:text-base 2xl:text-lg">Interested in sponsoring? Fill out this contact form, and our team will be in touch with more details!</p>
                    </div>
                    <div className="flex justify-center md:bg-gray-300 mt-6 md:mt-0 rounded-xl w-full h-auto md:basis-1/2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 md:px-12 py-10 w-full h-auto">
                                <FormField
                                control={form.control}
                                name="fname"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="text-base">Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} className="bg-white border-2 border-gray-400 h-12"/>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="company"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="text-base">Company</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} className="bg-white border-2 border-gray-400 h-12"/>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="text-base">Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} className="bg-white border-2 border-gray-400 h-12"/>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="inquiry"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="text-base">Inquiry</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} className="bg-white border-2 border-gray-400 w-full h-48"/>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />                                
                                <Button type="submit" className="bg-hoverpurple px-9 py-5 rounded-3xl font-bold text-white tracking-widest">Submit</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
            <footer className="bg-white w-full h-40"></footer>
        </main>
    )
}
/*
                            <label htmlFor="fname " className="mt-14 mb-4">Full Name</label>
                            <input type="text" id="fname" className="rounded-md w-full h-12"></input>
                            <label htmlFor="company" className="mt-6 mb-4">Company</label>
                            <input type="text" id="company" className="rounded-md w-full h-12"></input>
                            <label htmlFor="email" className="mt-6 mb-4">Email</label>
                            <input type="text" id="email" className="rounded-md w-full h-12"></input>
                            <label htmlFor="inquiry" className="mt-4 mb-2">Inquiry</label>
                            <input type="text" id="inquiry" className="rounded-md w-full h-48"></input>
                            <button type="submit" className="bg-white my-12 px-8 py-2 rounded-md">Submit</button>
*/