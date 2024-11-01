'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
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
		      <li className="navbar-item">
            <Link href="/register" className="text-bold">Register</Link>
          </li>
		      <li className="navbar-item">
            <Link href="/login" className="text-bold">Login</Link>
          </li>
	      </ul>
      </div>
    </nav>
  )
}   