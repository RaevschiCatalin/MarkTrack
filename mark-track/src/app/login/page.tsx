'use client'

import { useState } from 'react';
import Link from 'next/link';
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "@/config/firebaseConfig"

const handleLogin = async (email: string, password: string) => {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const token = await userCredential.user.getIdToken(); // Get JWT token
		// Send the token to your backend for further requests
		console.log("JWT Token:", token);
	} catch (error) {
		console.error("Error signing in: ", error);
	}
};

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	return (
		<div className="flex justify-center items-center h-screen pb-10">
			<div className="mx-auto flex w-full max-w-sm flex-col gap-6">
				<div className="flex flex-col items-center">
					<h1 className="text-3xl font-semibold">Sign In</h1>
					<p className="text-sm">Sign in to access your account</p>
				</div>
				<div className="form-group">
					<div className="form-field">
						<label className="form-label">Email address</label>
						<input
							placeholder="Type here"
							type="email"
							className="input input-block"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<label className="form-label">
							<span className="form-label-alt">Please enter a valid email.</span>
						</label>
					</div>
					<div className="form-field">
						<label className="form-label">Password</label>
						<div className="form-control">
							<input
								placeholder="Type here"
								type="password"
								className="input input-block"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</div>
					<div className="form-field">
						<div className="form-control justify-between">
							<div className="flex gap-2">
								<input type="checkbox" className="checkbox" />
								<a href="#">Remember me</a>
							</div>
							<label className="form-label">
								<Link href="/forgotPassword" className="link link-underline-hover link-primary text-sm">Forgot your password?</Link>
							</label>
						</div>
					</div>
					<div className="form-field pt-5">
						<div className="form-control justify-between">
							<button
								type="button"
								className="btn btn-primary w-full"
								onClick={() => handleLogin(email, password)}
							>
								Sign in
							</button>
						</div>
					</div>
					<div className="form-field">
						<div className="form-control justify-center">
							<Link href="/register" className="link link-underline-hover link-primary text-sm">Don't have an account yet? Sign up.</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}