import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeClosed } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { UserInput, UserLoginInput } from "../../../types/userInput";
import { toast } from "react-toastify";

import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useLoginMutation } from "../../../services/user";
import { setCredentials } from "../../../store/authSlice";

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [login] = useLoginMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserInput>();

  const onLogin: SubmitHandler<UserLoginInput> = async (userData) => {
    try {
      const response = await login(userData).unwrap();

      dispatch(setCredentials(response));
      toast.success("Logged in successfully.");
      navigate("/");
      reset();
    } catch (err: unknown) {
      const error = err as { status?: number; data?: { detail?: string } };
      if ("status" in error && error.status === 401) {
        toast.error(error.data?.detail ?? "Invalid credentials.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <form onSubmit={handleSubmit(onLogin)} className="flex flex-col">
      <label className="text-sm text-black">Email address</label>
      <input
        type="email"
        className="text-sm bg-white border outline-0 p-2 mb-6"
        placeholder="Enter your email address"
        {...register("email", {
          required: "Email is required",
          pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
        })}
      />
      {errors.email && (
        <p className="text-red-500 text-xs">{errors.email.message}</p>
      )}
      <label className="text-sm text-black">Password</label>
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          className="text-sm w-full flex-9/10 bg-white border outline-0 p-2 mb-6"
          placeholder="Enter your password here"
          {...register("password", {
            required: "Password is required",
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="cursor-pointer absolute top-2 right-2 flex items-center text-gray-400"
        >
          {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
        </button>
      </div>

      <button
        type="submit"
        className="cursor-pointer bg-black text-white p-1 rounded ml-[70%]"
        value="continue"
      >
        Continue
      </button>
    </form>
  );
};

export default LoginPage;
