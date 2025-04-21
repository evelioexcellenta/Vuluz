import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import Alert from "../../components/UI/Alert";
import { ROUTES } from "../../constants/routes";
import useAuth from "../../hooks/useAuth";
import { isValidEmail, isValidPassword } from "../../utils/validators";
import { APP_CONFIG } from "../../constants/config";

const Register = () => {
  const [error, setError] = useState("");
  const { register: registerUser, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Form validation with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      userName: "",
      gender: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  // For password confirmation validation
  const password = watch("password");

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setError("");
      const success = await registerUser({
        name: data.name,
        userName: data.userName,
        gender: data.gender,
        email: data.email,
        password: data.password,
      });
      console.log("Registration success, navigating...",success);

      if (success) {
        navigate(ROUTES.LOGIN);
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            {APP_CONFIG.APP_NAME}
          </h1>
          <h2 className="text-2xl font-bold text-gray-800">
            Create a new account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link
              to={ROUTES.LOGIN}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <Card className="animate-fade-in">
          <Card.Body>
            {error && (
              <Alert
                type="error"
                title="Registration Failed"
                message={error}
                onClose={() => setError("")}
                className="mb-4"
              />
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                id="name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                error={errors.name?.message}
                autoComplete="name"
                placeholder="John Doe"
                required
              />

              <Input
                label="Username"
                type="text"
                id="userName"
                {...register("userName", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                })}
                error={errors.userName?.message}
                autoComplete="userName"
                placeholder="johndoe123"
                required
              />

              <Input
                label="Gender"
                type="text"
                id="gender"
                {...register("gender", {
                  required: "gender is required",
                  minLength: {
                    value: 3,
                    message: "gender must be at least 3 characters",
                  },
                })}
                error={errors.gender?.message}
                autoComplete="gender"
                placeholder="Male/Female"
                required
              />

              <Input
                label="Email Address"
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  validate: {
                    validEmail: (value) =>
                      isValidEmail(value) || "Please enter a valid email",
                  },
                })}
                error={errors.email?.message}
                autoComplete="email"
                placeholder="your@email.com"
                required
              />

              <Input
                label="Password"
                type="password"
                id="password"
                {...register("password", {
                  required: "Password is required",
                  validate: {
                    validPassword: (value) =>
                      isValidPassword(value) ||
                      "Password must be at least 8 characters and contain at least one number and one letter",
                  },
                })}
                error={errors.password?.message}
                autoComplete="new-password"
                helper="At least 8 characters, including a number"
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: {
                    matchesPreviousPassword: (value) =>
                      value === password || "Passwords do not match",
                  },
                })}
                error={errors.confirmPassword?.message}
                autoComplete="new-password"
                required
              />

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                  required
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-600"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isLoading}
                >
                  Create Account
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Register;
