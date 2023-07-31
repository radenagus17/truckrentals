"use client";

import { Button } from "@mui/material";
import { motion } from "framer-motion";

function Hero() {
  return (
    <div className="bg-[url('/background.jpg')] bg-cover bg-center flex flex-col md:flex-row items-center lg:h-[93vh] py-12 relative">
      <div className="absolute z-[0] left-0 top-0 right-0 bottom-0 bg-black/[0.4]"></div>
      <div className="relative z-[99] max-w-[1240px] mx-auto p-5 text-center">
        <motion.div
          initial={{
            opacity: 0,
            translateY: 10,
          }}
          whileInView={{
            opacity: 1,
            translateY: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          viewport={{ once: true }}
          className="flex flex-col items-center lg:w-[80%] mx-auto"
        >
          <div className="text-[1.5rem] md:text-[2.25rem] text-white font-bold">
            Solusi Terpercaya untuk Rental Truk
          </div>
          <div className="mt-3 text-gray-300 text-[1rem] md:text-[1.25rem] lg:max-w-[80%]">
            Kami menyediakan rental truk yang handal dan efisien untuk memenuhi
            kebutuhan transportasi bisnis Anda
          </div>
          <Button
            href="#services"
            color="primary"
            variant="contained"
            className="bg-primary"
            sx={{
              color: "white",
              paddingInline: "20px",
              marginTop: "20px",
              fontSize: "1.1rem",
            }}
          >
            Lihat Jasa Sewa
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default Hero;
