"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import axios from 'axios';

type SetError = (msg: string) => void;

const handleLogin = async (
	email: string,
	password: string,
	setError: SetError
): Promise<boolean> => {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;

		if (!user.emailVerified) {
			setError("Please verify your email address before logging in.");
			return false;
		}

		const firebaseToken = await user.getIdToken();
		console.log(firebaseToken);
		const response = await axios.post("http://0.0.0.0:8000/login", { token: firebaseToken });

		if (response.status === 200) {
			localStorage.setItem("jwtToken", response.data.access_token);
			return true;
		}
	} catch (error: any) {
		if (error instanceof FirebaseError) {
			if (error.code === "auth/wrong-password") {
				setError("Invalid password. Please try again.");
			} else if (error.code === "auth/user-not-found") {
				setError("No account found with this email.");
			} else {
				setError("Something went wrong. Please try again.");
			}
		} else if (axios.isAxiosError(error)) {
			if (Array.isArray(error.response?.data?.detail)) {
				// Handle multiple errors
				const errorMessages = error.response?.data?.detail.map((err: any) => err.msg).join(", ");
				setError(errorMessages || "An error occurred. Please try again.");
			} else {
				setError(error.response?.data?.detail || "An error occurred. Please try again.");
			}
		} else {
			setError("Unexpected error. Please try again.");
		}
		return false;
	}
	return false;
};

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const onSubmit = async () => {
		setError(null);
		const success = await handleLogin(email, password, setError);
		if (success) {
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
					<input
						placeholder="Email address"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="input"
					/>
					<input
						placeholder="Password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="input"
					/>
					{error && Array.isArray(error) ? (
						<ul className="text-red-500">
							{error.map((err, index) => (
								<li key={index}>{err}</li>
							))}
						</ul>
					) : (
						error && <p className="text-red-500">{error}</p>
					)}
					<button onClick={onSubmit} className="btn btn-primary w-full">
						Sign in
					</button>
					<Link href="/register">Don&apos;t have an account yet? Sign up.</Link>
				</div>
			</div>
		</div>
	);
}
