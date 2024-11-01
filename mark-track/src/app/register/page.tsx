'use client'

import Link from 'next/link'

export default function Register() {
  return (
    <div className="flex justify-center items-center h-screen pb-10">
       <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
	        <div className="flex flex-col items-center">
		        <h1 className="text-3xl font-semibold">Sign Up</h1>
		        <p className="text-sm">Create a marktrack account</p>
	        </div>
	        <div className="form-group">
		        <div className="form-field">
			        <label className="form-label">Email address</label>
			        <input placeholder="Type here" type="email" className="input input-block" />
			        <label className="form-label">
				        <span className="form-label-alt">Enter your institutional email.</span>
			        </label>
		        </div>
		        <div className="form-field">
			        <label className="form-label">Password</label>
			        <div className="form-control">
				        <input placeholder="Type here" type="password" className="input input-block" />
			        </div>
		        </div>
            <div className="form-field">
			        <label className="form-label">Repeat Password</label>
			        <div className="form-control">
				        <input placeholder="Type here" type="password" className="input input-block" />
			        </div>
		        </div>
		        <div className="form-field pt-5">
			        <div className="form-control justify-between">
				        <button type="button" className="btn btn-primary w-full">Sign in</button>
			        </div>
		        </div>

		        <div className="form-field">
			        <div className="form-control justify-center">
				        <Link href="/login" className="link link-underline-hover link-primary text-sm">Already have an account? Sign in.</Link>
			        </div>
		        </div>
	        </div>
        </div>
    </div>
  )
}  