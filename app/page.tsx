"use client";

import Calculator from "@/components/home_page/calculator";
import Hero from "@/components/home_page/hero";
import LoginPopup from "@/components/home_page/login_popup";
import Services from "@/components/home_page/services";
import Footer from "@/components/layout/footer";
import Navigation from "@/components/layout/navigation";
import React from "react";

function Home() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <LoginPopup open={open} handleClose={handleClose} />
      <div id="hero"></div>
      <Navigation handleOpen={handleOpen} />
      <Hero />
      <Services />
      <Calculator />
      <Footer />
    </>
  );
}

export default Home;
