import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { isValidEmail } from "../../utils/validators";
import { ROUTES } from "../../constants/routes";
import illustration from "../../assets/vuluz.png";
import VLogo from "../../assets/V.png";

const Login = () => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      setError("");
      const success = await login(data);
      if (success) navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-poppins">
      {/* Left - Illustration */}
      <div className="flex flex-col items-center justify-center bg-[#F2F6FF] p-8 rounded-br-[40px]">
        {/* Logo */}
        <img
          src={VLogo}
          alt="Vuluz Logo"
          className="absolute top-[24px] left-[24px] w-[48px] h-[48px]"
        />
        <img
          src={illustration}
          alt="Illustration"
          className="max-w-full h-auto"
        />
      </div>

      {/* Right - Form */}
      <div className="flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-end text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link
              to={ROUTES.REGISTER}
              className="ml-1 font-semibold text-black hover:underline"
            >
              Sign up
            </Link>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Sign in</h1>
            <p className="text-gray-600 text-sm">Sign in to your account</p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 space-y-4 shadow-sm rounded-xl"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                {...register("email", {
                  required: "Email is required",
                  validate: {
                    validEmail: (value) =>
                      isValidEmail(value) || "Invalid email",
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M1 1l22 22M17.94 17.94C16.2 19.27 14.18 20 12 20c-5 0-9.27-3.11-11-8 1.03-2.81 2.92-5.11 5.33-6.44M9.88 9.88a3 3 0 004.24 4.24"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M1 12c2-4.89 6-8 11-8s9 3.11 11 8c-2 4.89-6 8-11 8s-9-3.11-11-8zm11 3a3 3 0 100-6 3 3 0 000 6z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot password */}
            <div className="text-right text-sm">
              <a href="#" className="text-primary-600 hover:underline">
                Forgot your password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#7C6AD9] text-white font-semibold rounded-lg hover:bg-[#6f5cc8] transition disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
