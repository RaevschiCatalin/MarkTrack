"use client";

import { useState } from 'react';
import Link from 'next/link';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { auth } from "@/config/firebaseConfig";

const handleLogin = async (email: string, password: string, setError: (msg: string) => void) => {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const token = await userCredential.user.getIdToken();
		console.log("JWT Token:", token);
		localStorage.setItem("jwtToken", token);
		return true;
	} catch (error: any) {
		if (error.code === "auth/wrong-password") {
			setError("Invalid password. Please try again.");
		} else if (error.code === "auth/user-not-found") {
			setError("No account found with this email.");
		} else {
			setError("Something went wrong. Please try again.");
		}
		return false;
	}
};

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const onSubmit = async () => {
		setError(null);  // Clear any existing error
		const success = await handleLogin(email, password, setError);
		if (success) {
			// Redirect to dashboard or any protected route
			router.push('/dashboard');
		}
	};

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

					{error && <p className="text-red-500">{error}</p>}

					<div className="form-field pt-5">
						<div className="form-control justify-between">
							<button
								type="button"
								className="btn btn-primary w-full"
								onClick={onSubmit}
							>
								Sign in
							</button>
						</div>
					</div>

					<div className="form-field">
						<div className="form-control justify-center">
							<Link href="/register" className="link link-underline-hover link-primary text-sm">
								Don't have an account yet? Sign up.
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
