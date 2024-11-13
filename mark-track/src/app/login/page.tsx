
'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const { login } = useAuth();

	const onSubmit = async () => {
		setError(null);
		const result = await login(email, password);
		if (result.success) {
			router.push('/dashboard');
		} else {
			setError(result.message || "Login failed. Please try again.");
		}
	};

	return (
		<div className="flex justify-center items-center h-screen pb-10">
			<div className="mx-auto flex w-full max-w-sm flex-col  gap-6">
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
					<div className="">
						<Link href="/forgotPassword" className="text-[#4A90E2]">Forgot password?</Link>
					</div>
					{error && <p className="text-red-500">{error}</p>}
					<button onClick={onSubmit} className="btn w-2/3 ">
						Sign in
					</button>
					<Link href="/register">Don&apos;t have an account yet? Sign up.</Link>
				</div>
			</div>
		</div>
	);
}
