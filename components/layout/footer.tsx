"use client";

import { menuList } from "./menu_list";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YoutubeIcon from "@mui/icons-material/YouTube";
import { Button } from "@mui/material";

function Footer() {
  return (
    <div id="footer" className="bg-primary text-white py-12">
      <div className="max-w-[1240px] mx-auto p-5 flex flex-col lg:flex-row lg:space-x-24">
        <div className="w-full">
          <img className="h-[5rem]" src="logo_white.png" alt="" />
          <div className="mt-5 text-[1rem] md:text-[1.1rem]">
            Selamat datang di Truck Rental, solusi terpercaya untuk kebutuhan
            rental truk yang profesional. Kami menyediakan layanan rental truk
            berkualitas tinggi yang dirancang untuk memudahkan dan mendukung
            segala kegiatan logistik bisnis Anda
          </div>
        </div>
        <div className="flex flex-col w-full lg:flex-row lg:space-x-36 mt-5 lg:mt-0 space-y-5 lg:space-y-0">
          <div>
            <div className="text-[1.5rem] font-semibold">Site Map</div>
            <div className="mt-5 flex flex-col space-y-4">
              {menuList.map((x) => {
                return (
                  <a className="hover:underline" href={x.href} key={x.id}>
                    {x.label}
                  </a>
                );
              })}
            </div>
          </div>
          <div>
            <div className="text-[1.5rem] font-semibold">Sosial Media</div>
            <div className="flex items-center space-x-5 mt-5">
              {socials.map((x) => {
                return (
                  <a
                    href={x.href}
                    target="_blank"
                    key={x.href}
                    className="hover:scale-[1.1] transition-all cursor-pointer"
                  >
                    {x.icon}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const socials = [
  {
    icon: <FacebookIcon sx={{ fontSize: "30px", color: "white" }} />,
    href: "https://www.facebook.com/",
  },
  {
    icon: <TwitterIcon sx={{ fontSize: "30px", color: "white" }} />,
    href: "https://www.twitter.com/",
  },
  {
    icon: <InstagramIcon sx={{ fontSize: "30px", color: "white" }} />,
    href: "https://www.instagram.com/",
  },
  {
    icon: <YoutubeIcon sx={{ fontSize: "30px", color: "white" }} />,
    href: "https://www.youtube.com/",
  },
];

export default Footer;
