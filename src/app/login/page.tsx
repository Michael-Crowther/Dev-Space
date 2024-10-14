"use client";
import { cn } from "@/lib/utils";
import { handleLogin } from "@/server/auth/login";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { BeatLoader } from "react-spinners";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const data = new FormData(e.currentTarget);

    try {
      await handleLogin(data);
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        setLoading(false);
      }
    }
  }

  const inputStyle = cn(
    "bg-zinc-900 h-10 rounded-sm mt-1 focus:outline-none px-3"
  );

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex items-center justify-center rounded-lg shadow-lg w-[400px] md:w-[760px] h-[420px] bg-zinc-800 flex-col">
        <p className="font-bold text-2xl mb-1">Welcome back!</p>
        <p className="text-muted-foreground">
          {`We're so excited to see you again!`}
        </p>
        <form className="flex flex-col w-2/3" onSubmit={handleSubmit}>
          <label className="flex flex-col my-4">
            <span className="text-gray-400">
              Email{" "}
              <span className="text-red-500">
                *{" "}
                {!!error && (
                  <span className="italic text-xs">
                    Email or password is invalid
                  </span>
                )}
              </span>
            </span>
            <input type="text" name="email" required className={inputStyle} />
          </label>
          <label className="flex flex-col mb-4">
            <span className="text-gray-400">
              Password{" "}
              <span className="text-red-500">
                *{" "}
                {!!error && (
                  <span className="italic text-xs">
                    Email or password is invalid
                  </span>
                )}
              </span>
            </span>
            <input
              type="password"
              name="password"
              required
              className={inputStyle}
            />
            {/* <a href="" className="text-sm text-brand mt-1 hover:underline">
              Forgot your password?
            </a> */}
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
            <a href="/register" className="text-brand hover:underline">
              Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
