import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Signup: React.FC<{ onToggle?: () => void }> = ({ onToggle }) => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFirstAdminSetup, setIsFirstAdminSetup] = useState(false);

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const response = await fetch("/api/admin/exists");
                const data = await response.json();
                setIsFirstAdminSetup(!data.exists);
            } catch (err) {
                console.error("Failed to check admin status", err);
            }
        };
        checkAdminStatus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const payload: {
                action: "register";
                name: string;
                email: string;
                password: string;
                isInitialSetup?: boolean;
            } = {
                action: "register",
                name,
                email,
                password
            };

            if (isFirstAdminSetup) {
                payload.isInitialSetup = true;
            }

            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }

            // Redirect based on user role
            window.dispatchEvent(new Event('authChange'));
            if (data.user?.role === "admin") {
                router.push("/admin/dashboard");
            } else {
                router.push("/");
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || "Registration failed. Please try again.");
            } else {
                setError("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full p-8 bg-white rounded shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {isFirstAdminSetup ? "Initial Admin Setup" : "Create Account"}
                </h2>
                
                {isFirstAdminSetup && (
                    <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500">
                        <p className="text-blue-700">
                            Welcome! You&aposre creating the first admin account for the system.
                        </p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block mb-1 font-medium">
                            Full Name:
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                            placeholder="Enter your full name"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1 font-medium">
                            Email Address:
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                            placeholder="Enter your email"
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-1 font-medium">
                            Password:
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                            placeholder="Create a strong password"
                        />
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}
                    
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded">
                            <p className="text-green-700">{success}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 text-white rounded-lg transition ${
                            loading 
                                ? "bg-gray-400 cursor-not-allowed" 
                                : "bg-blue-600 hover:bg-blue-700"
                        } font-medium`}
                    >
                        {loading ? (
                            <span>Processing...</span>
                        ) : isFirstAdminSetup ? (
                            "Create Admin Account"
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already have an account?{" "}
                        <button 
                            type="button" 
                            onClick={onToggle} 
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;