import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Alert from "../../components/UI/Alert";
import { ROUTES } from "../../constants/routes";
import useAuth from "../../hooks/useAuth";
import { isValidEmail, isValidPassword } from "../../utils/validators";
import { APP_CONFIG } from "../../constants/config";
import vuluzImage from "../../assets/vuluz.png";
import VLogo from "../../assets/V.png";
import successIcon from "../../assets/success.png";

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

  const password = watch("password");

  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.LOGIN);
  }, [isAuthenticated, navigate]);

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
                onSubmit={handleSubmit(() => setStep(2))}
                className="space-y-6"
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
                        placeholder="Aufa Biahdillah"
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
                        placeholder="aufabi"
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
                              isValidEmail(v) || "Invalid email",
                          },
                        })}
                        className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-primary"
                        placeholder="aufabi@gmail.com"
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
                            validPassword: (v) =>
                              isValidPassword(v) || "Min 8 chars, 1 number",
                          },
                        })}
                        className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-primary"
                        placeholder="••••••••"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm">
                          {errors.password.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        At least 8 characters, including a number
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
              <p className="text-sm text-gray-600 mb-6">Create your PIN!</p>
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
                      if (!/\d?/.test(val)) return;
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
              <Button
                onClick={() => setStep(3)}
                variant="primary"
                fullWidth
                className="bg-primary text-white font-semibold text-sm h-[57px] rounded-[8px]"
              >
                Confirm
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold mb-2">Re-enter PIN</h2>
              <p className="text-sm text-gray-600 mb-6">Re-enter your PIN</p>
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
              <Button
                onClick={async () => {
                  if (confirmPin !== pin) {
                    setError("PINs do not match");
                    return;
                  }
                  setError("");
                  const data = getValues();
                  const success = await registerUser({
                    name: data.name,
                    userName: data.userName,
                    gender: data.gender || "N/A",
                    email: data.email,
                    password: data.password,
                    pin: confirmPin,
                  });
                  if (success) setStep(4);
                }}
                variant="primary"
                fullWidth
              >
                Confirm
              </Button>
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
