"use client";
import { ButtonLoader } from "@/components/utils/ButtonLoader";
import { toast } from "@/hooks/use-toast";
// import { PrettyObject } from "@/components/utils/PrettyObject";
import { cn } from "@/lib/utils";
import { register } from "@/server/actions/register";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] =
    useState<Record<string, string[] | string | undefined>>();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const data = new FormData(e.currentTarget);

    const result = await register(data);

    if (result) {
      setLoading(false);
      if (result.zodErrors) setErrors(result.zodErrors);
      else if (result.sqlError) setErrors(result.sqlError);
      else {
        router.push("/login");
        toast({ description: result.message });
      }
    }
  }

  const inputStyle = cn(
    "bg-zinc-900 h-10 rounded-sm mt-1 focus:outline-none px-3"
  );

  const errorStyle = cn("text-red-500 italic text-sm mt-1");

  return (
    <div className="w-full h-screen flex justify-center items-center">
      {/* <PrettyObject>{errors}</PrettyObject> */}
      <div className="flex items-center justify-center rounded-lg shadow-lg w-[500px] h-[700px] bg-zinc-800 flex-col">
        <p className="font-bold text-2xl">Create an account</p>
        <form className="flex flex-col w-5/6" onSubmit={handleSubmit}>
          <div className="flex mt-2 space-x-3">
            <label className="flex flex-col my-4 w-1/2">
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
            <label className="flex flex-col my-4 w-1/2">
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
              Email{" "}
              <span className="text-red-500">
                *{" "}
                {(errors?.email || errors?.message?.includes("email")) && (
                  <p className={errorStyle}>
                    {errors.email || "Email already exists"}
                  </p>
                )}
              </span>
            </span>
            <input type="text" name="email" required className={inputStyle} />
          </label>
          <label className="flex flex-col">
            <span className="text-gray-400">
              Display Name{" "}
              <span className="text-red-500">
                {errors?.displayName && (
                  <p className={errorStyle}>{errors.displayName}</p>
                )}
              </span>
            </span>
            <input type="text" name="displayName" className={inputStyle} />
          </label>
          <label className="flex flex-col my-4">
            <span className="text-gray-400">
              Username{" "}
              <span className="text-red-500">
                *{" "}
                {(errors?.username ||
                  errors?.message?.includes("username")) && (
                  <p className={errorStyle}>
                    {errors.username || "Username already exists"}
                  </p>
                )}
              </span>
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
            {loading ? <ButtonLoader /> : "Continue"}
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
