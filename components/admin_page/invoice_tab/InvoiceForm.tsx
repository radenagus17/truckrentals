"use client";

import { useState, useContext, useMemo } from "react";
import { uid } from "uid";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";
import { Button, TextField, CircularProgress } from "@mui/material";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "@/firebase_config";
import { PriceContext } from "@/context/PriceContext";

const date = new Date();
const today = date.toLocaleDateString("en-GB", {
  month: "numeric",
  day: "numeric",
  year: "numeric",
});

const InvoiceForm = ({ toTab }: any) => {
  const { lists } = useContext(PriceContext);
  const [isOpen, setIsOpen] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState(1);
  const [telahTerimaDari, setTelahTerimaDari] = useState("");
  const [order, setOrder] = useState("");
  const [resHarga, setResHarga] = useState(0);
  const [resBerat, setResBerat] = useState(0);
  const [uangSejumlah, setUangSejumlah] = useState("");
  const [lastItem, setLastItem] = useState(false);
  const [loading, setLoading] = useState(false);
  const [titikAwal, setTitikAwal] = useState<any>({});
  const [titikAkhir, setTitikAkhir] = useState<any>({});
  const [kota_A, setKota_A] = useState("");
  const [kota_B, setKota_B] = useState("");
  const [cost, setCost] = useState(0);
  const [items, setItems] = useState([
    {
      id: uid(6),
      uraian: "",
      qty: 1,
      jenisTruk: "CDD",
      // kota: "Jakarta - Bandung",
      lokasi_awal: "",
      lokasi_akhir: "",
      rate: 0,
      // jarakKota: 0,
      qtyBags: 0,
      kg: 0,
      harga: 0,
      keterangan: "",
    },
  ]);

  // console.log(items);

  const createInvoiceHandler = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    setTimeout(async () => {
      if (items.length < 2 || lastItem) {
        let dataOrder = {};
        if (!order && !lastItem) {
          dataOrder = await addDoc(collection(db, "orders"), {
            telah_terima_dari: telahTerimaDari,
            invoiceDate: today,
            totalPrice: total,
            telah_dibayar: uangSejumlah,
            invoiceNumber: invoiceNumber,
            jenis_truk: items[items.length - 1].jenisTruk,
            // kota: items[items.length - 1].kota,
            lokasi_awal: items[items.length - 1].lokasi_awal,
            lokasi_akhir: items[items.length - 1].lokasi_akhir,
            rate: items[items.length - 1].rate,
            totalBerat: totalBerat,
            status: "PENDING",
            platKendaraan: "",
            supir: "",
          });
          setResHarga(resHarga + items[items.length - 1].harga);
          setResBerat(+resBerat + Number(items[items.length - 1].kg));
        }

        await addDoc(collection(db, "invoices"), {
          idOrder: order ?? dataOrder.id,
          invoiceNumber: invoiceNumber,
          uraian: items[items.length - 1].uraian,
          jenisTruk: items[items.length - 1].jenisTruk,
          // kota: items[items.length - 1].kota,
          lokasi_awal: items[items.length - 1].lokasi_awal,
          lokasi_akhir: items[items.length - 1].lokasi_akhir,
          rate: items[items.length - 1].rate,
          kg: items[items.length - 1].kg,
          // jarakKota: items[items.length - 1].jarakKota,
          qtyBags: items[items.length - 1].qtyBags,
          harga: items[items.length - 1].harga,
          keterangan: items[items.length - 1].keterangan,
        });

        setResHarga(resHarga + items[items.length - 1].harga);
        setResBerat(+resBerat + Number(items[items.length - 1].kg));

        if (order) {
          await updateDoc(doc(db, "orders", order), {
            totalPrice: resHarga + items[items.length - 1].harga,
            totalBerat: +resBerat + Number(items[items.length - 1].kg),
          });
        }
      } else {
        toTab(1);
      }
      setLoading(false);
      toTab(1);
    }, 3000);
  };

  // const addNextInvoiceHandler = () => {
  //   setInvoiceNumber((prevNumber) => prevNumber);
  //   setItems([
  //     {
  //       id: uid(6),
  //       uraian: "",
  //       qty: 1,
  //       jenisTruk: "CDD",
  //       kota: "Jakarta - Bandung",
  //       jarakKota: 0,
  //       qtyBags: 0,
  //       kg: 0,
  //       harga: 0,
  //       keterangan: "",
  //     },
  //   ]);
  // };

  const addItemHandler = async (e) => {
    e.preventDefault();
    // const id = uid(6);
    setLastItem(true);
    let dataOrder = {};
    // let totHarga = 0
    // console.log(typeof order);
    if (!order) {
      dataOrder = await addDoc(collection(db, "orders"), {
        telah_terima_dari: telahTerimaDari,
        // uidInv: order ? order : inv.id,
        invoiceDate: today,
        totalPrice: total,
        telah_dibayar: uangSejumlah,
        invoiceNumber: invoiceNumber,
        jenis_truk: items[items.length - 1].jenisTruk,
        // kota: items[items.length - 1].kota,
        lokasi_awal: items[items.length - 1].lokasi_awal,
        lokasi_akhir: items[items.length - 1].lokasi_akhir,
        rate: items[items.length - 1].rate,
        totalBerat: totalBerat,
        status: "PENDING",
        platKendaraan: "",
        supir: "",
      });
      setOrder(dataOrder.id);
    }

    await addDoc(collection(db, "invoices"), {
      invoiceNumber: invoiceNumber,
      idOrder: !order ? dataOrder.id : order,
      uraian: items[items.length - 1].uraian,
      jenisTruk: items[items.length - 1].jenisTruk,
      // kota: items[items.length - 1].kota,
      lokasi_awal: items[items.length - 1].lokasi_awal,
      lokasi_akhir: items[items.length - 1].lokasi_akhir,
      rate: items[items.length - 1].rate,
      kg: items[items.length - 1].kg,
      // jarakKota: items[items.length - 1].jarakKota,
      qtyBags: items[items.length - 1].qtyBags,
      harga: items[items.length - 1].harga,
      keterangan: items[items.length - 1].keterangan,
    });

    setResHarga(resHarga + items[items.length - 1].harga);
    setResBerat(+resBerat + Number(items[items.length - 1].kg));

    setItems((prevItem) => [
      ...prevItem,
      {
        id: uid(6),
        uraian: "",
        qty: 1,
        jenisTruk: "CDD",
        // kota: "Jakarta - Bandung",
        lokasi_awal: "",
        lokasi_akhir: "",
        rate: 0,
        // jarakKota: 0,
        qtyBags: 0,
        kg: 0,
        harga: 0,
        keterangan: "",
      },
    ]);
  };

  const deleteItemHandler = (id: any) => {
    setItems((prevItem) => prevItem.filter((item) => item.id !== id));
  };

  const edtiItemHandler = (event: any) => {
    const editedItem = {
      id: event.target.id,
      name: event.target.name,
      value: event.target.value,
    };
    const newItems = items.map((items: any) => {
      for (const key in items) {
        if (key === editedItem.name && items.id === editedItem.id) {
          items[key] = editedItem.value;
          items["lokasi_awal"] = kota_A;
          items["lokasi_akhir"] = kota_B;
          items["rate"] = cost;
          // items["harga"] = calculatePrice(+items["kg"], +items["jarakKota"]);
          items["harga"] = calculatePrice(+items["kg"]);
        }
      }
      return items;
    });

    setItems(newItems);
  };

  const calculatePrice = (bebanMuatan: number) => {
    let price = 0;
    let distance = calculateDistance(
      titikAwal.lat,
      titikAwal.lng,
      titikAkhir.lat,
      titikAkhir.lng
    );
    lists.map((rate) => {
      for (const key in rate) {
        if (
          rate.id == rate[key] &&
          rate["distance_to"] >= distance &&
          distance >= rate["distance_from"]
        ) {
          setCost(Number(rate["rate"]));
          price = Number(bebanMuatan) * Number(rate["rate"]);
        }
      }
    });
    return price;
    // let rate = 0;
    // if (distance >= 1 && distance <= 10) {
    //   rate = 91;
    // } else if (distance > 10 && distance <= 20) {
    //   rate = 118;
    // } else if (distance > 20 && distance <= 30) {
    //   rate = 148;
    // } else if (distance > 30 && distance <= 40) {
    //   rate = 167;
    // } else if (distance > 40 && distance <= 100) {
    //   rate = 260;
    // } else if (distance > 100 && distance <= 200) {
    //   rate = 320;
    // } else if (distance > 200 && distance <= 300) {
    //   rate = 400;
    // } else if (distance > 300 && distance <= 400) {
    //   rate = 550;
    // } else if (distance > 400 && distance <= 500) {
    //   rate = 675;
    // }

    // return rate * bebanMuatan;
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
      setKota_A(place.formatted_address);
      setTitikAwal({
        lat: Number(place.geometry.location.lat()),
        lng: Number(place.geometry.location.lng()),
      });
    }
  };

  const titikAkhirHandler = (place: any) => {
    if (place) {
      setKota_B(place.formatted_address);
      setTitikAkhir({
        lat: Number(place.geometry.location.lat()),
        lng: Number(place.geometry.location.lng()),
      });
    }
  };

  // console.log(kota_A, kota_B);

  const total = items.reduce((total, num) => {
    return total + Number(num.harga);
  }, 0);
  const totalBerat = items.reduce((total, num) => {
    return total + Number(num.kg);
  }, 0);

  return (
    <div>
      <form onSubmit={createInvoiceHandler}>
        <div className="my-6 rounded-md bg-white p-4 border space-y-8 md:p-6">
          <div className="flex flex-col justify-between border-b border-gray-900/10 pb-4 md:flex-row md:items-center">
            <div className="flex space-x-2">
              <span className="font-bold">Tanggal Hari Ini : </span>
              <span>{today}</span>
            </div>
            <div className="flex items-center space-x-2">
              <label className="font-bold" htmlFor="invoiceNumber">
                Kode Invoice :
              </label>
              <input
                required
                className="max-w-[150px] border p-1 outline-none"
                type="number"
                name="invoiceNumber"
                id="invoiceNumber"
                min="1"
                step="1"
                value={invoiceNumber}
                onChange={(event) =>
                  setInvoiceNumber(event.target.value as any)
                }
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-sm font-bold sm:text-base w-[155px]">
              Telah Terima Dari :
            </div>
            <TextField
              required
              sx={{ width: "fit-content" }}
              label="Telah Terima Dari"
              type="text"
              name="telahTerimaDari"
              id="telahTerimaDari"
              value={telahTerimaDari}
              onChange={(event) => setTelahTerimaDari(event.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-sm font-bold sm:text-base w-[150px]">
              Uang sejumlah :
            </div>
            <TextField
              required
              sx={{ width: "fit-content" }}
              label="Uang Sejumlah"
              type="text"
              name="uangSejumlah"
              id="uangSejumlah"
              value={uangSejumlah}
              onChange={(event) => setUangSejumlah(event.target.value)}
            />
          </div>

          <div className="w-full overflow-x-scroll">
            <table className="w-full p-4 text-left">
              <thead>
                <tr className="border-b border-gray-900/10 text-sm md:text-base">
                  <th>No</th>
                  <th>Uraian</th>
                  <th>Jenis Truk</th>
                  {/* <th>Kota</th> */}
                  <th>Lokasi Awal</th>
                  <th>Lokasi Akhir</th>
                  {/* <th>Jarak ( Dalam KM )</th> */}
                  <th>QTY Bags</th>
                  <th>Kg</th>
                  <th>Harga</th>
                  <th>Keterangan</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <InvoiceItem
                    index={index}
                    key={item.id}
                    id={item.id}
                    uraian={item.uraian}
                    jenisTruk={item.jenisTruk}
                    // kota={item.kota}
                    titikAwal={titikAwalHandler}
                    titikAkhir={titikAkhirHandler}
                    lokasi_awal={item.lokasi_awal}
                    lokasi_akhir={item.lokasi_akhir}
                    qtyBags={item.qtyBags}
                    kg={item.kg}
                    harga={item.harga}
                    keterangan={item.keterangan}
                    onDeleteItem={deleteItemHandler}
                    onEditItem={edtiItemHandler}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <Button
            onClick={addItemHandler}
            variant="contained"
            className="bg-primary"
            sx={{ color: "white" }}
          >
            Tambahkan Item
          </Button>
          {/* Total  */}
          <div className="flex flex-col space-y-2 mt-5 w-full">
            <div className="flex w-full justify-between pt-2 md:w-1/2">
              <span className="font-bold">Total Harga :</span>
              <span className="font-bold">
                {total.toLocaleString().replaceAll(",", ".")}
              </span>
            </div>
          </div>
          <Button
            type="submit"
            fullWidth={true}
            variant="contained"
            className="bg-primary"
            sx={{ color: "white" }}
          >
            {loading ? `loading...` : `Buat Invoice`}
          </Button>
        </div>

        {/* <div>
          <InvoiceModal
            toTab={toTab}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            invoiceInfo={{
              invoiceNumber,
              total,
              telahTerimaDari,
              uangSejumlah,
            }}
            items={items}
            onAddNextInvoice={addNextInvoiceHandler}
          />
        </div> */}
      </form>
    </div>
  );
};

export default InvoiceForm;
