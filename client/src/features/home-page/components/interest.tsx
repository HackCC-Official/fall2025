"use client"
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

console.log(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)


export const Interest = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            setStatus("Please enter a valid email address. 📧");
            return;
        }

        setStatus("Submitting...");

        const { error } = await supabase.from("interested_users").insert([{ email }]);

        if (error) {
            if (error.code === "23505") {
                setStatus("You're already signed up! 🎉");
            } else {
                setStatus("Error: " + error.message);
            }
        } else {
            setStatus("You're signed up! 🎉");
            setEmail("");
        }
    };

    
    return (
        <div>
            <form onSubmit={handleSubmit}>
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
            </form>
        {status && <p className="flex flex-col md:text-md text-sm lg:text-lg text-center">{status}</p>}
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
