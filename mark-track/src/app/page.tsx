"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        setFadeIn(true);
    }, []);

    return (
        <div className="!bg-[#f2f2f2] from-indigo-50 to-indigo-100 min-h-screen flex flex-col items-center text-gray-800 font-sans">
            <header className="sticky top-0 w-full bg-indigo-900 text-white p-5 flex justify-between items-center">
                <div className="text-2xl font-bold">marktrack</div>
                <nav className="space-x-6 text-lg">
                    <Link href="#features" className="hover:underline">Features</Link>
                    <Link href="/about" className="hover:underline">About</Link>
                    <Link href="/login" className="hover:underline">Login</Link>
                    <Link href="/register" className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-all text-white font-semibold shadow-lg">Sign Up</Link>
                </nav>
            </header>

            <main className={`flex flex-col items-center text-center px-4 py-20 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
                <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 text-gray-900 tracking-tight">
                    Organize Your Academic Life with Ease
                </h1>
                <p className="text-lg mb-8 text-gray-700">
                    Track your grades, courses, and academic progress all in one place.
                </p>
                <Link href="/register">
                    <button className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-lg transition-transform transform hover:scale-105 focus:ring-4 focus:ring-indigo-400 ring-opacity-50 hover:bg-indigo-600">
                        Get Started
                    </button>
                </Link>
            </main>
        </div>
    );
}
