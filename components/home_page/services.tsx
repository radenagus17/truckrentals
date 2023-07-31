"use client";

import { db } from "@/firebase_config";
import FadeVertical from "@/utils/FadeVertical";
import { Button } from "@mui/material";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface service {
  jenisTruk: string;
  bebanMuatan: number;
  imageUrl: string;
}

function Services() {
  const [data, setData] = useState<any>([]);

  const getData = () => {
    onSnapshot(collection(db, "services"), (snapshot) => {
      let items: any = [];
      snapshot.docs.map((x: any) => items.push({ ...x.data(), id: x.id }));
      setData(items);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const container = {
    hidden: { opacity: 0, y: 100 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  

  return (
    <div
      id="services"
      className="max-w-[1240px] mx-auto p-5 flex flex-col md:items-center py-12 lg:py-24"
    >
      <div className="text-[1.5rem] md:text-[2rem] text-primary font-semibold text-left md:text-center">
        Jasa Yang Kami Sediakan
      </div>

      <div className="lg:max-w-[60%] text-left md:text-center mt-2 text-gray-500 text-[1rem] md:text-[1.1rem]">
        Layanan penyewaan truk kami adalah yang terbaik dalam industri ini,
        memberikan kehandalan, efisiensi, dan kepuasan pelanggan yang tak
        tertandingi.
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        className="grid grid-cols-1 md:grid-cols-3 mt-10 gap-5"
      >
        {data?.map((x: service) => {
          return (
            <FadeVertical key={x.imageUrl}>
              <div className="bg-white drop-shadow-lg border">
                <img
                  className="h-[15rem] w-full object-cover"
                  src={x.imageUrl}
                  alt=""
                />
                <div className="p-5">
                  <div className="font-semibold text-[1.25rem]">
                    {x.jenisTruk}
                  </div>
                  <div className="mt-2">
                    Beban Muatan Maksimal : {x.bebanMuatan} kg
                  </div>
                  <Button
                    href="https://api.whatsapp.com/081234567891"
                    target="_blank"
                    variant="contained"
                    className="bg-primary"
                    color="primary"
                    fullWidth={true}
                    sx={{ color: "white", marginTop: 1 }}
                  >
                    Order Sekarang
                  </Button>
                </div>
              </div>
            </FadeVertical>
          );
        })}
      </motion.div>
    </div>
  );
}

export default Services;
