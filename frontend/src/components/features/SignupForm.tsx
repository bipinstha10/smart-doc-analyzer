import { useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { UserInput } from "../../types/userInput";
import { toast } from "react-toastify";

import { usePostUsersMutation } from "../../services/user";

const SignupForm = () => {
  const navigate = useNavigate();

  const [createUser] = usePostUsersMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserInput>();

  const onSubmit: SubmitHandler<UserInput> = async (userData) => {
    try {
      const response = await createUser(userData).unwrap();

      if (response.status === 201) {
        toast.success(response.message);
        navigate("/");
        reset();
      }
    } catch (err: any) {
      if ("status" in err && err.status === 409) {
        toast.error("Email already registered");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <label className="text-sm text-black">Name *</label>
      <input
        type="text"
        className="text-sm bg-white border outline-0 p-2 mb-6"
        placeholder="Enter your name"
        {...register("name", {
          required: "Name is required",
          minLength: {
            value: 2,
            message: "Name must be at least 2 characters",
          },
        })}
      />
      {errors.name && (
        <p className="text-red-500 text-xs">{errors.name.message}</p>
      )}
      <label className="text-sm text-black">Email*</label>
      <input
        type="text"
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
      <label className="text-sm text-black">Mobile Number *</label>
      <input
        type="text"
        className="text-sm bg-white border outline-0 p-2 mb-6"
        placeholder="Enter your mobile number"
        {...register("phone", {
          required: "Mobile number is required",
          pattern: {
            value: /^[0-9]{10,15}$/,
            message: "Enter a valid phone number",
          },
        })}
      />
      {errors.phone && (
        <p className="text-red-500 text-xs">{errors.phone.message}</p>
      )}
      <label className="text-sm text-black">Password *</label>
      <input
        className="text-sm w-full flex-9/10 bg-white border outline-0 p-2 mb-6"
        placeholder="Enter your password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
      />
      {errors.password && (
        <p className="text-red-500 text-xs">{errors.password.message}</p>
      )}

      <label className="text-sm text-black">Confirm Password *</label>
      <input
        type="password"
        className="text-sm bg-white border outline-0 p-2 mb-6"
        placeholder="Confirm your password"
        {...register("confirmPassword", {
          required: "Please confirm your password",
          validate: (value) =>
            value === watch("password") || "Password do not match",
        })}
      />
      {errors.confirmPassword && (
        <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
      )}
      <button
        type="submit"
        className="cursor-pointer bg-black text-white p-1 rounded ml-[70%]"
      >
        Register
      </button>
    </form>
  );
};

export default SignupForm;
