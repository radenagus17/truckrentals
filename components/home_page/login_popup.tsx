import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Key";
import CloseIcon from "@mui/icons-material/Close";

import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { app, db } from "@/firebase_config";
import { toast } from "react-toastify";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

interface loginModal {
  open: boolean;
  handleClose: () => void;
}

export default function LoginPopup({ open, handleClose }: loginModal) {
  const auth = getAuth(app);
  const [loading, setLoading] = React.useState(false);
  const [inputData, setInputData] = React.useState({
    email: "",
    password: "",
  });

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
        handleClose();
        setLoading(false);
      } catch (error) {
        toast("Invalid Email or Password");
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="flex items-center justify-between">
          <div className="text-[1.25rem]">Login Khusus Admin</div>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginHandler();
          }}
        >
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
      </Box>
    </Modal>
  );
}
