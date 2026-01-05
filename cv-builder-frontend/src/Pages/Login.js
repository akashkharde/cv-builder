import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Redux/features/auth/authThunks";
import { resetAuthState } from "../Redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (formData) => {
    const resultAction = await dispatch(
      loginUser({
        identifier: formData.identifier,
        password: formData.password,
      })
    );

    // ✅ redirect on success
    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/");
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
          Login
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email / Username */}
          <TextField
            label="Email or Username"
            fullWidth
            error={!!errors.identifier}
            helperText={errors.identifier?.message}
            {...register("identifier", {
              required: "Email or username is required",
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
            })}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <Typography variant="body2" align="center" className="mt-4">
          Don&apos;t have an account?{" "}
          <Button
            component={Link}
            to="/register"
            variant="text"
            size="small"
          >
            Register
          </Button>
        </Typography>
      </div>
    </div>
  );
}
