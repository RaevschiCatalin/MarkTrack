'use client';

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'


export default function Navbar() {
    const { isLoggedIn, logout } = useAuth()

    return (
        <nav className="navbar navbar-no-boxShadow navbar-bordered navbar-sticky !bg-[#F2F2F2] shadow-md">
            <div className="navbar-start">
                <Link href="/">
                    <img
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
                            <Link href="/dashboard" className="text-[#2E2E2E] font-bold hover:text-[#4A90E2] transition-colors">
                                Dashboard
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link href="/profile" className="group">
                                <svg
                                    className="fill-current text-[#2E2E2E] group-hover:text-[#F5C200] transition-all"
                                    height="40" viewBox="0 0 32 32" width="40" xmlns="http://www.w3.org/2000/svg"
                                >
                                    {/* Outer Circle */}
                                    <path
                                        className="group-hover:fill-[#F5C200]"
                                        d="m16 8a5 5 0 1 0 5 5 5 5 0 0 0 -5-5zm0 8a3 3 0 1 1 3-3 3.0034 3.0034 0 0 1 -3 3z"
                                    />
                                    {/* Inner Details (Lines) */}
                                    <path
                                        className="group-hover:fill-[#A2D9A9]"
                                        d="m16 2a14 14 0 1 0 14 14 14.0158 14.0158 0 0 0 -14-14zm-6 24.3765v-1.3765a3.0033 3.0033 0 0 1 3-3h6a3.0033 3.0033 0 0 1 3 3v1.3765a11.8989 11.8989 0 0 1 -12 0zm13.9925-1.4507a5.0016 5.0016 0 0 0 -4.9925-4.9258h-6a5.0016 5.0016 0 0 0 -4.9925 4.9258 12 12 0 1 1 15.985 0z"
                                    />
                                    {/* Invisible Background */}
                                    <path d="m0 0h32v32h-32z" fill="none"/>
                                </svg>
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <button
                                className="btn btn-rounded bg-green-9 text-[#f2f2f2] font-bold hover:bg-[#F5C200] hover:text-black transition-colors"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li className="navbar-item">
                            <Link href="/register"
                                  className="btn btn-rounded bg-green-9 text-white border-green-9 hover:bg-white hover:text-black hover:border-green-9 hover:border-2 font-bold transition-colors">
                                Register
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link href="/login"
                                  className="btn btn-rounded bg-transparent text-green-9 border-green-9 border-2 hover:bg-green-9 hover:text-white hover:border-green-9 font-bold transition-colors">
                                Login
                            </Link>
                        </li>

                    </>
                )}
            </ul>
        </nav>
    )
}
