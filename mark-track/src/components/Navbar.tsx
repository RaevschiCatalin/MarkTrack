'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('jwtToken')
        if (token) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }, [])

    return (
        <nav className="navbar navbar-no-boxShadow navbar-bordered navbar-sticky">
            <div className="navbar-start">
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="MarkTrack Logo"
                        width={158}
                        height={158}
                    />
                </Link>
                <ul className="navbar-end">
                    {isLoggedIn ? (
                        <>
                            <li className="navbar-item">
                                <Link href="/dashboard" className="text-bold">Dashboard</Link>
                            </li>
                            <li className="navbar-item">
                                <Link href="/profile">
                                    <button className="btn btn-rounded btn-outline">Profile</button>
                                </Link>
                            </li>
                            <li className="navbar-item">
                                <button
                                    className="btn btn-rounded btn-secondary"
                                    onClick={() => {
                                        localStorage.removeItem('jwtToken')
                                        setIsLoggedIn(false)
                                    }}
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="navbar-item">
                                <button className="btn btn-rounded btn-outline">
                                    <Link href="/register" className="text-bold">Register</Link>
                                </button>
                            </li>
                            <li className="navbar-item">
                                <button className="btn btn-rounded btn-secondary">
                                    <Link href="/login" className="text-bold">Login</Link>
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    )
}
