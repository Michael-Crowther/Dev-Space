"use client";
import { handleLogin } from "@/server/auth/login";
import { useState } from "react";
import { BeatLoader } from "react-spinners";

export default function Login() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex items-center justify-center rounded-lg shadow-lg w-[400px] md:w-[760px] h-[420px] bg-zinc-800 flex-col">
        <p className="font-bold text-2xl mb-1">Welcome back!</p>
        <p className="text-muted-foreground">
          {`We're so excited to see you again!`}
        </p>
        <form
          className="flex flex-col w-2/3"
          action={handleLogin}
          onSubmit={() => setLoading(true)}
        >
          <label className="flex flex-col my-4">
            <span className="text-gray-400">
              Email or Phone Number <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              name="emailPhone"
              required
              className="bg-zinc-900 h-10 rounded-sm mt-1 focus:outline-none px-3"
            />
          </label>
          <label className="flex flex-col mb-4">
            <span className="text-gray-400">
              Password <span className="text-red-500">*</span>
            </span>
            <input
              type="password"
              name="password"
              required
              className="bg-zinc-900 h-10 rounded-sm mt-1 focus:outline-none px-3"
            />
            <a href="" className="text-sm text-brand mt-1 hover:underline">
              Forgot your password?
            </a>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="bg-brand rounded-sm p-3 hover:cursor-pointer flex items-center justify-center h-12"
          >
            {loading ? <BeatLoader color="#92DDFD" size={10} /> : "Log In"}
          </button>
          <div className="flex items-center space-x-1 text-sm mt-2">
            <p className="text-gray-400">Need an account?</p>
            <a href="" className="text-brand hover:underline">
              Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

// export function Register() {
//   return <div>Register form</div>;
// }
