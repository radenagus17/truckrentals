"use client";
import * as React from "react";
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Key";
// import CloseIcon from "@mui/icons-material/Close";

import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { app, db } from "@/firebase_config";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Page() {
  const auth = getAuth(app);
  const [loading, setLoading] = React.useState(false);
  const [inputData, setInputData] = React.useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData((prevState) => {
      return {
        ...prevState,
        [e.target.id]: e.target.value,
      };
    });
  };

  const loginHandler = async () => {
    if (inputData.email !== "" && inputData.password !== "") {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(
          auth,
          inputData.email,
          inputData.password
        );
        toast("Login Berhasil");

        setTimeout(() => {
          setLoading(false);
          router.push("/admin");
        }, 700);
      } catch (error) {
        toast("Invalid Email or Password");
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center px-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          loginHandler();
        }}
        className="p-6 shadow-lg border border-blue-900/10 min-w-[37em]"
      >
        <h1 className="md:text-3xl text-2xl text-blue-900 font-bold pb-2 text-center">
          Welcome Back Admin
        </h1>
        <TextField
          id="email"
          onChange={inputHandler}
          sx={{ marginTop: 3 }}
          label="Email"
          type="email"
          fullWidth={true}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="password"
          onChange={inputHandler}
          sx={{ marginTop: 3 }}
          label="Password"
          type="password"
          fullWidth={true}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <PasswordIcon />
              </InputAdornment>
            ),
          }}
        />
        {loading ? (
          <div className="flex justify-center mt-5">
            <CircularProgress />
          </div>
        ) : (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="bg-primary"
            fullWidth={true}
            sx={{ marginTop: 3, color: "white" }}
          >
            Login
          </Button>
        )}
      </form>
    </div>
  );
}
