"use client";

import { cn } from "@/lib/utils";
import { handleRegister } from "@/server/auth/register";
import { useState } from "react";
import { BeatLoader } from "react-spinners";

export default function Register() {
  const [loading, setLoading] = useState(false);

  const inputStyle = cn(
    "bg-zinc-900 h-10 rounded-sm mt-1 focus:outline-none px-3"
  );

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex items-center justify-center rounded-lg shadow-lg w-[480px] h-[650px] bg-zinc-800 flex-col">
        <p className="font-bold text-2xl">Create an account</p>
        <form
          className="flex flex-col w-5/6"
          action={handleRegister}
          onSubmit={() => {
            setLoading(true);
          }}
        >
          <div className="flex gap-5 mt-2">
            <label className="flex flex-col my-4">
              <span className="text-gray-400">
                First Name <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                name="firstName"
                required
                className={inputStyle}
              />
            </label>
            <label className="flex flex-col my-4">
              <span className="text-gray-400">
                Last Name <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                name="lastName"
                required
                className={inputStyle}
              />
            </label>
          </div>
          <label className="flex flex-col mb-4">
            <span className="text-gray-400">
              Email <span className="text-red-500">*</span>
            </span>
            <input type="text" name="email" required className={inputStyle} />
          </label>
          <label className="flex flex-col">
            <span className="text-gray-400">Display Name</span>
            <input type="text" name="displayName" className={inputStyle} />
          </label>
          <label className="flex flex-col my-4">
            <span className="text-gray-400">
              Username <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              name="username"
              required
              className={inputStyle}
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
              className={inputStyle}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="bg-brand rounded-sm p-3 hover:cursor-pointer flex items-center justify-center h-12 mt-4"
          >
            {loading ? <BeatLoader color="#92DDFD" size={10} /> : "Continue"}
          </button>
          <a
            href="/login"
            className="text-brand hover:underline text-sm font-semibold mt-5"
          >
            Already have an account?
          </a>
        </form>
      </div>
    </div>
  );
}
