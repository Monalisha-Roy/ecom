import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginProps {
    onToggle?: () => void;
}

const Login: React.FC<LoginProps> = ({ onToggle }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'login',
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Redirect based on user role
                window.dispatchEvent(new Event('authChange'));
                if (data.user?.role === "admin") {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/");
                }
            } else {
                throw new Error(data.message || "Login failed");
            }
            
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || "Login failed. Please try again.");
            } else {
                setError("Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full p-8 bg-white rounded shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1 font-medium">
                            Email:
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                        />
                    </div>

                    <div className="mb-4">
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
                        />
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 text-white rounded transition ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center mt-4">
                    Don&apost have an account?
                    <button
                        onClick={onToggle}
                        className="text-blue-500 ml-1 font-medium"
                    >
                        Signup
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;