'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'



export default function Navbar() {
    const { isLoggedIn, logout } = useAuth()

    return (
        <nav className="navbar navbar-no-boxShadow navbar-bordered navbar-sticky bg-transparent ">
            <div className="navbar-start">
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="MarkTrack Logo"
                        width={158}
                        height={158}
                    />
                </Link>
            </div>
            <ul className="navbar-end flex items-center gap-4">
                {isLoggedIn ? (
                    <>
                        <li className="navbar-item">
                            <Link href="/dashboard" className="text-bold">Dashboard</Link>
                        </li>
                        <li className="navbar-item">
                            <Link href="/profile">
                                <Image src={"/profile.svg"} alt={"Profile"} height={32} width={32}></Image>
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <button
                                className="btn btn-rounded btn-secondary"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li className="navbar-item">
                            <Link href="/register" className="btn btn-rounded btn-outline text-bold">Register</Link>
                        </li>
                        <li className="navbar-item">
                            <Link href="/login" className="btn btn-rounded btn-secondary text-bold">Login</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    )
}
