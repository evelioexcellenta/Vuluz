import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppLayout from "../../components/Layout/AppLayout";
import Button from "../../components/UI/Button";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { authAPI } from "../../utils/api";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const location = useLocation();
  const { register, handleSubmit, setValue } = useForm();
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || "");
  const [status, setStatus] = useState("idle"); // 'idle' | 'success' | 'error'

  // Reset status setiap kali navigasi (location.key berubah)
  useEffect(() => {
    setStatus("idle");
  }, [location.key]);

  // Isi form saat user data ready
  useEffect(() => {
    if (!user) return;
    setValue("userName", user.userName);
    setValue("fullName", user.fullName);
    setValue("walletNumber", user.walletNumber);
    setValue("email", user.email);
    setAvatarPreview(user.avatarUrl || "");
  }, [user, setValue]);

  const onSubmit = async (data) => {
    try {
      // Kirim update ke server
      await authAPI.editProfile({
        fullName: data.fullName,
        userName: data.userName,
      });

      // Fetch profile terbaru
      const refreshed = await authAPI.getProfile();

      // Update context
      await updateProfile(refreshed);

      setStatus("success");
    } catch (err) {
      console.error("Edit Profile Error:", err);
      setStatus("error");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8 min-h-[400px]">
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Profile saved successfully!
            </h2>
          </div>
        ) : status === "error" ? (
          <div className="text-center text-red-600 font-semibold py-12">
            Failed to save profile. Please try again.
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6 font-poppins">Profile</h1>

            {/* Avatar */}
            <div className="flex items-center justify-center flex-col space-y-4 mb-6">
              <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <svg
                    className="w-12 h-12 text-primary"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4zM12 2a4 4 0 110 8 4 4 0 010-8z" />
                  </svg>
                )}
              </div>
              <button className="bg-blue-100 text-primary px-4 py-2 rounded-md text-sm font-medium">
                Edit Photo
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 font-poppins"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  {...register("userName")}
                  className="w-full border rounded-md px-4 py-2 mt-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  {...register("fullName")}
                  className="w-full border rounded-md px-4 py-2 mt-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account Number
                </label>
                <input
                  {...register("walletNumber")}
                  disabled
                  className="w-full border rounded-md px-4 py-2 mt-1 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  {...register("email")}
                  disabled
                  className="w-full border rounded-md px-4 py-2 mt-1 bg-gray-100"
                />
              </div>

              <Button
                type="submit"
                fullWidth
                variant="primary"
                className="bg-primary text-white font-semibold text-sm h-[57px] rounded-[8px] mt-4"
              >
                Save Changes
              </Button>
            </form>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Profile;
