'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { FirebaseError } from 'firebase/app';

interface AuthContextType {
    isLoggedIn: boolean;
    accessToken: string | null;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

interface LoginResponse {
    access_token: string;
    token_type: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            setIsLoggedIn(true);
            setAccessToken(token);
        }
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                return { success: false, message: "Please verify your email address before logging in." };
            }

            const firebaseToken = await user.getIdToken();
            const response = await axios.post<LoginResponse>("http://0.0.0.0:8000/login", { token: firebaseToken });

            if (response.status === 200) {
                const token = response.data.access_token;
                localStorage.setItem('jwtToken', token);
                setIsLoggedIn(true);
                setAccessToken(token);
                return { success: true };
            }
            return { success: false, message: "Login failed." };
        } catch (error: unknown) {
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case "auth/wrong-password":
                        return { success: false, message: "Invalid password. Please try again." };
                    case "auth/user-not-found":
                        return { success: false, message: "No account found with this email." };
                    default:
                        return { success: false, message: "Something went wrong. Please try again." };
                }
            } else if (error instanceof AxiosError && error.response) {
                const axiosErrorResponse = error.response.data as { detail?: string | { msg: string }[] };

                const errorMessage =
                    Array.isArray(axiosErrorResponse.detail)
                        ? axiosErrorResponse.detail.map((err) => err.msg).join(", ")
                        : axiosErrorResponse.detail || "An error occurred. Please try again.";

                return { success: false, message: errorMessage };
            } else if (error instanceof Error) {
                return { success: false, message: error.message };
            } else {
                return { success: false, message: "Unexpected error. Please try again." };
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setIsLoggedIn(false);
        setAccessToken(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
