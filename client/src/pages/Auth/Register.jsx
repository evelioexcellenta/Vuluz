import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Alert from "../../components/UI/Alert";
import { ROUTES } from "../../constants/routes";
import useAuth from "../../hooks/useAuth";
import { isValidEmail } from "../../utils/validators";
import vuluzImage from "../../assets/vuluz.png";
import VLogo from "../../assets/V.png";
import successIcon from "../../assets/success.png";

// Enhanced password validator with stronger requirements
const isStrongPassword = (password) => {
  // At least 8 characters, with at least one uppercase letter, one lowercase letter, and one number
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  return hasMinLength && hasUpperCase && hasNumber && hasLowerCase;
};

const Register = () => {
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const { register: registerUser, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    setError: setFormError,
    clearErrors,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      userName: "",
      gender: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  const password = watch("password");

  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.LOGIN);
  }, [isAuthenticated, navigate]);

  // Handle form submission for step 1
  const onSubmitStep1 = async (data) => {
    try {
      // Basic validation - already handled by react-hook-form
      clearErrors();
      setError("");
      setStep(2);
    } catch (err) {
      console.error("Form validation error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  // Go back to previous step
  const goBack = () => {
    setStep(step - 1);
    setError(""); // Clear any errors when going back
  };

  // Handle registration submission
  const handleRegistration = async () => {
    try {
      if (confirmPin.length !== 6) {
        setError("PIN must be 6 digits");
        return;
      }

      if (confirmPin !== pin) {
        setError("PINs do not match");
        return;
      }

      setError("");
      const data = getValues();

      console.log("Attempting to register user with data", {
        name: data.name,
        userName: data.userName,
        email: data.email,
        gender: data.gender,
        // Never log passwords or PINs in production
      });

      const success = await registerUser({
        name: data.name,
        userName: data.userName,
        gender: data.gender || "N/A",
        email: data.email,
        password: data.password,
        pin: confirmPin,
      });

      console.log("Registration response:", success);

      if (success) {
        setStep(4);
      } else {
        // Changed error message here
        setError("Your email has been used");
      }
    } catch (err) {
      console.error("Registration error:", err);

      // Specifically handle the "Email already exists" error format from the API log
      const errorMessage = err.message || "";

      if (errorMessage.includes("Email already exists")) {
        // Changed error message here
        setError("Your email has been used");
        // Go back to step 1 and mark the email field as invalid
        setStep(1);

        // Set form-level error for the email field
        setTimeout(() => {
          setFormError("email", {
            type: "manual",
            message: "Your email has been used",
          });
        }, 100);
      } else if (errorMessage.includes("PIN must be")) {
        setError("PIN must be 6 numeric digits");
      } else if (errorMessage.toLowerCase().includes("password")) {
        setError(errorMessage || "Password does not meet requirements");
        setStep(1);
        setTimeout(() => {
          setFormError("password", {
            type: "manual",
            message: errorMessage || "Password does not meet requirements",
          });
        }, 100);
      } else {
        setError(`Registration error: ${errorMessage || "Unknown error"}`);
      }
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white font-poppins">
      <div className="flex flex-col bg-[#F2F6FF] p-6 rounded-br-[40px]">
        <img src={VLogo} alt="Logo V" className="w-[48px] h-[48px] mb-4 ml-4" />
        <img
          src={vuluzImage}
          alt="Illustration"
          className="max-w-full h-auto mx-auto"
        />
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold mb-2">Create a new account</h2>
              <p className="text-sm text-gray-600 mb-4">
                Or{" "}
                <Link
                  to={ROUTES.LOGIN}
                  className="text-primary font-medium hover:underline"
                >
                  sign in to your existing account
                </Link>
              </p>
              <form
                onSubmit={handleSubmit(onSubmitStep1)}
                className="space-y-6"
                noValidate
              >
                <Card>
                  <Card.Body className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-primary"
                        placeholder="Your Name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Username<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register("userName", {
                          required: "Username is required",
                        })}
                        className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-primary"
                        placeholder="username"
                      />
                      {errors.userName && (
                        <p className="text-red-500 text-sm">
                          {errors.userName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email Address<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          validate: {
                            validEmail: (v) =>
                              isValidEmail(v) || "Invalid email format",
                          },
                        })}
                        className={`w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 ${
                          errors.email
                            ? "border-red-500 focus:ring-red-500"
                            : "focus:ring-primary"
                        }`}
                        placeholder="youremail@mail.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Gender<span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register("gender", {
                          required: "Gender is required",
                        })}
                        className="w-full px-4 py-2 mt-1 border rounded-md bg-white focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {errors.gender && (
                        <p className="text-red-500 text-sm">
                          {errors.gender.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Password<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        {...register("password", {
                          required: "Password is required",
                          validate: {
                            strongPassword: (v) =>
                              isStrongPassword(v) ||
                              "Password must be at least 8 characters with uppercase, lowercase, and number",
                          },
                        })}
                        className={`w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 ${
                          errors.password
                            ? "border-red-500 focus:ring-red-500"
                            : "focus:ring-primary"
                        }`}
                        placeholder="••••••••"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm">
                          {errors.password.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        At least 8 characters, including uppercase, lowercase,
                        and a number
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Confirm Password<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: {
                            matchesPreviousPassword: (v) =>
                              v === password || "Passwords do not match",
                          },
                        })}
                        className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-primary"
                        placeholder="••••••••"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center">
                      <input
                        id="terms"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-primary border-gray-300 rounded"
                      />
                      <label
                        htmlFor="terms"
                        className="ml-2 text-sm text-gray-600"
                      >
                        I agree to the{" "}
                        <a
                          href="#"
                          className="font-medium text-primary hover:underline"
                        >
                          Terms and Conditions
                        </a>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      fullWidth
                      variant="primary"
                      className="bg-primary text-white font-semibold text-sm h-[57px] rounded-[8px]"
                    >
                      Create Account
                    </Button>
                  </Card.Body>
                </Card>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold mb-2">Create PIN</h2>
              <p className="text-sm text-gray-600 mb-6">
                Create your 6-digit security PIN!
              </p>
              <div className="flex justify-center gap-3 mb-6">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="password"
                    inputMode="numeric"
                    maxLength="1"
                    className="w-14 h-14 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={pin[i] || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!/^\d?$/.test(val)) return;
                      const updated = pin.split("");
                      updated[i] = val;
                      setPin(updated.join(""));
                      if (val && i < 5)
                        document.getElementById(`pin-${i + 1}`)?.focus();
                    }}
                    onKeyDown={(e) =>
                      e.key === "Backspace" &&
                      !pin[i] &&
                      i > 0 &&
                      document.getElementById(`pin-${i - 1}`)?.focus()
                    }
                    id={`pin-${i}`}
                  />
                ))}
              </div>
              <div className="flex space-x-4">
                <Button
                  onClick={goBack}
                  variant="secondary"
                  className="flex-1 bg-gray-100 border border-gray-300 text-gray-700 font-semibold text-sm h-[57px] rounded-[8px]"
                >
                  Go Back
                </Button>
                <Button
                  onClick={() => {
                    if (pin.length !== 6) {
                      setError("PIN must be 6 digits");
                      return;
                    }
                    setError("");
                    setStep(3);
                  }}
                  variant="primary"
                  className="flex-1 bg-primary text-white font-semibold text-sm h-[57px] rounded-[8px]"
                >
                  Confirm
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold mb-2">Re-enter PIN</h2>
              <p className="text-sm text-gray-600 mb-6">
                Re-enter your 6-digit PIN
              </p>
              <div className="flex justify-center gap-3 mb-6">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="password"
                    inputMode="numeric"
                    maxLength="1"
                    className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={confirmPin[i] || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!/^\d?$/.test(val)) return;
                      const newConfirmPin = confirmPin.split("");
                      newConfirmPin[i] = val;
                      setConfirmPin(newConfirmPin.join(""));
                      if (val && i < 5) {
                        const nextInput = document.getElementById(
                          `confirm-pin-${i + 1}`
                        );
                        nextInput?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !confirmPin[i] && i > 0) {
                        const prevInput = document.getElementById(
                          `confirm-pin-${i - 1}`
                        );
                        prevInput?.focus();
                      }
                    }}
                    id={`confirm-pin-${i}`}
                  />
                ))}
              </div>
              <div className="flex space-x-4">
                <Button
                  onClick={goBack}
                  variant="secondary"
                  className="flex-1 bg-gray-100 border border-gray-300 text-gray-700 font-semibold text-sm h-[57px] rounded-[8px]"
                >
                  Go Back
                </Button>
                <Button
                  onClick={handleRegistration}
                  variant="primary"
                  disabled={isLoading}
                  className="flex-1 bg-primary text-white font-semibold text-sm h-[57px] rounded-[8px]"
                >
                  {isLoading ? "Processing..." : "Confirm"}
                </Button>
              </div>
            </>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <img
                src={successIcon}
                alt="Success"
                className="w-[83px] h-[80px] mx-auto"
              />
              <h2 className="text-2xl font-semibold text-gray-900">
                Registration Successful
              </h2>
              <Button
                onClick={() => navigate(ROUTES.LOGIN)}
                variant="primary"
                fullWidth
                className="bg-primary text-white font-semibold text-sm h-[57px] rounded-[8px]"
              >
                Go to your account
              </Button>
            </div>
          )}

          {error && (
            <Alert
              type="error"
              title="Error"
              message={error}
              onClose={() => setError("")}
              className="mt-4"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
