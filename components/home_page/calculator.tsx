"use client";

import { Button, TextField } from "@mui/material";
import { useState } from "react";
import TruckIcon from "@mui/icons-material/LocalShipping";
import MoneyIcon from "@mui/icons-material/PaidOutlined";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import { toast } from "react-toastify";

interface data {
  jenisTruk: string;
  bebanMuatan: number;
  selisihJarak: number;
}

function Calculator() {
  const [inputData, setInputData] = useState<data>({
    jenisTruk: "",
    bebanMuatan: 0,
    selisihJarak: 0,
  });

  const [harga, setHarga] = useState(0);
  const [titikAwal, setTitikAwal] = useState<any>({});
  const [titikAkhir, setTitikAkhir] = useState<any>({});

  const calculatePrice = (bebanMuatan: number, distance: number) => {
    let rate = 0;
    if (distance >= 1 && distance <= 10) {
      rate = 91;
    } else if (distance > 10 && distance <= 20) {
      rate = 118;
    } else if (distance > 20 && distance <= 30) {
      rate = 148;
    } else if (distance > 30 && distance <= 40) {
      rate = 167;
    } else if (distance > 40 && distance <= 100) {
      rate = 260;
    } else if (distance > 100 && distance <= 200) {
      rate = 320;
    } else if (distance > 200 && distance <= 300) {
      rate = 400;
    } else if (distance > 300 && distance <= 400) {
      rate = 550;
    } else if (distance > 400 && distance <= 500) {
      rate = 675;
    }

    if (bebanMuatan >= 0) {
      let price = Number(bebanMuatan) * rate;
      setHarga(price);
    } else {
      console.log("wrong");
    }
  };

  function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    const earthRadius = 6371; // in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance;
  }

  function toRadians(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  const titikAwalHandler = (place: any) => {
    if (place) {
      setTitikAwal({
        lat: Number(place.geometry.location.lat()),
        lng: Number(place.geometry.location.lng()),
      });
    }
  };

  const titikAkhirHandler = (place: any) => {
    if (place) {
      setTitikAkhir({
        lat: Number(place.geometry.location.lat()),
        lng: Number(place.geometry.location.lng()),
      });
    }
  };

  return (
    <div
      id="kalkulasi"
      className="max-w-[1240px] mx-auto p-5 flex flex-col space-y-6 py-12 lg:py-24"
    >
      <div className="text-[1.5rem] md:text-[2rem] text-primary text-center font-semibold">
        Kalkulasi Harga Penyewaan Truk
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (
            titikAwal.lat &&
            titikAwal.lng &&
            titikAkhir.lat &&
            titikAkhir.lng &&
            inputData.bebanMuatan > 0
          ) {
            let distance = calculateDistance(
              titikAwal.lat,
              titikAwal.lng,
              titikAkhir.lat,
              titikAkhir.lng
            );
            if (distance <= 500) {
              setInputData((prevState) => {
                return {
                  ...prevState,
                  selisihJarak: distance,
                };
              });
              calculatePrice(Number(inputData.bebanMuatan), Number(distance));
            } else {
              toast("Jarak Tidak Boleh Melebihi 500 KM");
            }
          } else {
            toast("Masukkan Seluruh Data");
          }
        }}
        className="flex flex-col space-y-5"
      >
        <TextField
          type="number"
          fullWidth={true}
          onChange={(e) => {
            setInputData((prevState: any) => {
              return {
                ...prevState,
                bebanMuatan: e.target.value,
              };
            });
          }}
          name="bebanMuatan"
          label="Beban Muatan Dalam Kg ( Maksimal 10.000 Kg )"
          value={inputData.bebanMuatan}
        />
        <div className="w-full">
          <ReactGoogleAutocomplete
            className="border p-5 w-full"
            placeholder="Masukkan Titik Awal Lokasi"
            apiKey={process.env.NEXT_PUBLIC_API_KEY}
            onPlaceSelected={titikAwalHandler}
          />
        </div>
        <div className="w-full">
          <ReactGoogleAutocomplete
            className="border p-5 w-full"
            placeholder="Masukkan Titik Awal Lokasi"
            apiKey={process.env.NEXT_PUBLIC_API_KEY}
            onPlaceSelected={titikAkhirHandler}
          />
        </div>
        <Button type="submit" variant="contained" className="bg-primary">
          Hitung Jarak & Harga
        </Button>
      </form>
      <div>
        Keterangan : Untuk dalam kota hanya bisa menggunakan truk CDD ( Fuso dan
        Wingbox tidak bisa berjalan dalam kota )
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center space-x-5 md:space-x-2">
          <TruckIcon fontSize="large" />
          <div>Selisih Jarak : {inputData.selisihJarak.toFixed(2)} KM</div>
        </div>
        <div className="flex items-center space-x-5 md:space-x-2 mt-5 md:mt-0">
          <MoneyIcon fontSize="large" />
          <div className="flex flex-col md:flex-row md:items-center space-x-1">
            <div>Total Harga Untuk Penyewaan Truk :</div>
            <div className="text-primary font-semibold mt-3 md:mt-0">
              Rp {harga.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
