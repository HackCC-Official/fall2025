"use client"
import { useState } from "react";
/*import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
); */

export const Interest = () => {
  /*  const [email, setEmail] = useState("");
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

        const { data, error } = await supabase.from("interested_users").insert([{ email }]);

        if (error) {
            if (error.code === "23505") { // 23505 = unique_violation in PostgreSQL
                setStatus("You're already signed up! 🎉");
            } else {
                setStatus("Error: " + error.message);
            }
        } else {
            setStatus("You're signed up! 🎉");
            setEmail("");
        }
    };*/
    return (
        <div>
            <div>
                <input 
                name="email" 
                className="py-2 px-4 rounded-md md:my-5 md:mr-5 my-3 mr-3" 
                type="email" 
                placeholder="Enter your email address"
                />
                <button type='submit' className="bg-pink-300 hover:bg-pink-400 text-white py-2 px-6 rounded-md cursor-pointer">Get Notified</button>
            </div>
        </div>
    )
}

/*
<div>
            <form onSubmit={handleSubmit}>
            <div>
                <input 
                name="email" 
                className="py-2 px-4 rounded-md md:my-5 md:mr-5 my-3 mr-3" 
                type="email" 
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                <button type='submit' className="bg-pink-300 hover:bg-pink-400 text-white py-2 px-6 rounded-md cursor-pointer">Get Notified</button>
            </div>
        </form>
        {status && <p className="lg:text-lg md:text-md text-sm flex flex-col text-center">{status}</p>}
        </div>
        /*
