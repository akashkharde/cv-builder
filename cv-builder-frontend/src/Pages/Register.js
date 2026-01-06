import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../Redux/features/auth/authThunks";
import { resetAuthState } from "../Redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, touchedFields },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");


  useEffect(() => {
    if (touchedFields.confirmPassword) {
      trigger("confirmPassword");
    }
  }, [password, touchedFields.confirmPassword, trigger]);


  const onSubmit = async (formData) => {
    const resultAction = await dispatch(
      registerUser({
        username: formData.username,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
      })
    );

    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/login');
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resetAuthState());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">
        <Typography variant="h5" className="mb-6">
          Create Account
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <TextField
            label="Username"
            fullWidth
            error={!!errors.username}
            helperText={errors.username?.message}
            {...register("username", {
              required: "Username is required",
              minLength: { value: 3, message: "Minimum 3 characters" },
              maxLength: { value: 30, message: "Maximum 30 characters" },
            })}
          />

          {/* Email */}
          <TextField
            label="Email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email address",
              },
            })}
          />

          {/* Phone */}
          <TextField
            label="Phone (optional)"
            fullWidth
            error={!!errors.phone}
            helperText={errors.phone?.message}
            {...register("phone", {
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: "Phone must be 10–15 digits",
              },
            })}
          />

          {/* Password */}
          <TextField
            label="Password"
            type="password"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                message:
                  "8+ chars with uppercase, lowercase & number required",
              },
            })}
          />

          {/* Confirm Password */}
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>
        <Typography variant="body2" align="center" className="mt-4">
          Don&apos;t have an account?{" "}
          <Button
            component={Link}
            to="/login"
            variant="text"
            size="small"
          >
            Login
          </Button>
        </Typography>
      </div>
    </div>
  );
}
