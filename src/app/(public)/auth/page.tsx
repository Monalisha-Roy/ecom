'use client';
import { useState } from "react";
import Login from "@/components/auth/login";
import Signup from "@/components/auth/signup";

export default function AuthPage() {
    const [showSignup, setShowSignup] = useState(false);

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            {showSignup ? (
                <Signup  onToggle={() => setShowSignup(false)} />
            ) : (
                <Login onToggle={() => setShowSignup(true)} />
            )}
        </div>
    );
}