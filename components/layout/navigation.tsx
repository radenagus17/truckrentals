"use client";

import PersonIcon from "@mui/icons-material/Person";
import { Button, IconButton } from "@mui/material";
import { menuList } from "./menu_list";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebase_config";
import LogoutIcon from "@mui/icons-material/Logout";
import { toast } from "react-toastify";
import Link from "next/link";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

function Navigation({ handleOpen }: any) {
  const auth = getAuth(app);
  const [activeUser, setActiveUser] = useState(false);
  const [menu, setMenu] = useState(false);
  const [float, setFloat] = useState(false);

  const detectUser = () => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        return;
      } else {
        setActiveUser(true);
      }
    });
  };

  const handleScroll = () => {
    if (window.scrollY > 500) {
      setFloat(true);
    } else {
      setFloat(false);
    }
  };

  useEffect(() => {
    detectUser();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Normal Nav */}
      <div className="p-5 flex items-center justify-between relative z-[1] bg-white">
        {/* Logo  */}
        <img className="h-[2.5rem] md:h-[3rem]" src="/logo.png" alt="" />

        {/* Menu  */}
        <div className="hidden md:flex items-center space-x-5">
          {menuList.map((x) => {
            return (
              <Button href={x.href} key={x.id} sx={{ color: "black" }}>
                {x.label}
              </Button>
            );
          })}
          {
            activeUser ? (
              <div className="flex items-center space-x-5">
                <Link href="/admin">
                  <Button sx={{ color: "black" }}>Admin</Button>
                </Link>
                <IconButton
                  onClick={() => {
                    auth.signOut();
                    setActiveUser(false);
                    toast("Log Out Berhasil");
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </div>
            ) : undefined
            // (
            //   <Button
            //     variant="contained"
            //     className="bg-primary"
            //     onClick={handleOpen}
            //     sx={{ color: "white" }}
            //   >
            //     Login
            //   </Button>
            // )
          }
        </div>

        {/* Menu Button  */}
        <div className="md:hidden">
          <IconButton onClick={() => setMenu(!menu)}>
            <MenuIcon fontSize="large" />
          </IconButton>
        </div>
      </div>

      {/* Floating Nav  */}
      <div
        className={`${
          float ? "translate-y-0" : "translate-y-[-100%]"
        } fixed top-0 left-0 w-full transition-all p-5 z-[9998] bg-white drop-shadow-lg flex items-center justify-between`}
      >
        {/* Logo  */}
        <img className="h-[2.5rem] md:h-[3rem]" src="/logo.png" alt="" />

        {/* Menu  */}
        <div className="hidden md:flex items-center space-x-5">
          {menuList.map((x) => {
            return (
              <Button href={x.href} key={x.id} sx={{ color: "black" }}>
                {x.label}
              </Button>
            );
          })}
          {
            activeUser ? (
              <div className="flex items-center space-x-5">
                <Link href="/admin">
                  <Button sx={{ color: "black" }}>Admin</Button>
                </Link>
                <IconButton
                  onClick={() => {
                    auth.signOut();
                    setActiveUser(false);
                    toast("Log Out Berhasil");
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </div>
            ) : undefined
            // (
            //   <Button
            //     variant="contained"
            //     className="bg-primary"
            //     onClick={handleOpen}
            //     sx={{ color: "white" }}
            //   >
            //     Login
            //   </Button>
            // )
          }
        </div>

        {/* Menu Button  */}
        <div className="md:hidden">
          <IconButton onClick={() => setMenu(!menu)}>
            <MenuIcon fontSize="large" />
          </IconButton>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={`${
          menu ? "translate-x-[0]" : "translate-x-[-100%]"
        } transition-all fixed left-0 top-0 h-[100vh] p-5 bg-white drop-shadow-md z-[9999]`}
      >
        <div className="flex justify-between items-center space-x-12">
          <img className="h-[3rem]" src="/logo.png" alt="" />
          <IconButton onClick={() => setMenu(false)}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="flex flex-col space-y-5 mt-12">
          {menuList.map((x) => {
            return (
              <div key={x.id + x.label}>
                <Button sx={{ color: "black" }} href={x.href}>
                  {x.label}
                </Button>
              </div>
            );
          })}
          {
            activeUser ? (
              <>
                <Link href="/admin">
                  <Button sx={{ color: "black" }}>Admin</Button>
                </Link>
                <Button
                  onClick={() => {
                    auth.signOut();
                    setActiveUser(false);
                    toast("Log Out Berhasil");
                  }}
                  variant="contained"
                  className="bg-primary"
                >
                  Log Out
                </Button>
              </>
            ) : undefined
            // (
            //   <Button
            //     variant="contained"
            //     className="bg-primary"
            //     onClick={handleOpen}
            //     sx={{ color: "white" }}
            //   >
            //     Login
            //   </Button>
            // )
          }
        </div>
      </div>
      {/* Mobile Nav End  */}
    </>
  );
}

export default Navigation;
