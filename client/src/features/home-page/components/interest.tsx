"use client"
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const Interest = () => {
    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(false);
    const [status, setStatus] = useState("");
    const [success, setSuccess] = useState(false);

    const verifyEmail = (e:string) => {
        setEmail(e)
        setEmailValid(isValidEmail(e))
    }

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!emailValid) {
            setStatus("Please enter a valid email address. 📧");
            return;
        }

        setStatus("Submitting...");

        const { error } = await supabase.from("interested_users").insert([{ email }]);

        if (error) {
            if (error.code === "23505") {
                setStatus("You have already been added to the list to receive updates about the event!");
                setSuccess(true)
            } else {
                setStatus("Error: " + error.message);
            }
        } else {
            setStatus("You have been added to the list to receive updates about the event!");
            setEmail("");
            setSuccess(true)
        }
    };

    
    return (
        <div className="lg:w-[550px] md:w-[450px] sm:w-[400px] w-[300px] font-mont bg-black bg-opacity-20 px-7 py-7 rounded-3xl relative lg:text-lg md:text-md text-sm flex flex-col text-center z-10">
            {
                !success &&
                <form onSubmit={handleSubmit} className="">
                    <p>Sign up to receive updates <br className="sm:hidden inline" /> about the event</p>
                    <div className="flex sm:flex-row flex-col items-center pt-3 md:pt-5">
                        <input 
                        name="email" 
                        className="sm:w-2/3 w-full bg-white sm:mb-0 mb-3 sm:mr-3 md:mr-5 px-4 py-2 rounded-md text-center text-black" 
                        type="email" 
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => verifyEmail(e.target.value)}
                        required
                        />
                        <button disabled={email == ""} type='submit' id="subBTN" className={`sm:w-1/3 w-full text-nowrap text-center ${emailValid? 'bg-navyblue hover:bg-hoverpurple cursor-pointer text-white' : 'bg-dullpurple cursor-default text-black'} py-2 rounded-md`}>Get Notified</button>
                    </div>
                </form>
            }
            {status && <p className={`${(status == "Submitting...") && 'mt-3 md:mt-5'}flex flex-col md:text-md text-sm lg:text-lg text-center`}>{status}</p>}
            </div>
    )
}

/*
<div>
            <form onSubmit={handleSubmit}>
            <div>
                <input 
                name="email" 
                className="my-3 md:my-5 mr-3 md:mr-5 px-4 py-2 rounded-md" 
                type="email" 
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                <button type='submit' className="bg-pink-300 hover:bg-pink-400 px-6 py-2 rounded-md text-white cursor-pointer">Get Notified</button>
            </div>
        </form>
        {status && <p className="flex flex-col md:text-md text-sm lg:text-lg text-center">{status}</p>}
        </div>
        */
