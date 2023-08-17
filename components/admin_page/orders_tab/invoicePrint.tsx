"use client";
import React, { Fragment, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { Dialog, Transition } from "@headlessui/react";
import { Button, CircularProgress } from "@mui/material";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "@/firebase_config";

export default function PrintInvoice({
  isOpen,
  setIsOpen,
  invoiceInfo,
  // items,
  onAddNextInvoice,
}: any) {
  const DownloadInvoice = async () => {
    try {
      const dom = document.getElementById("print") as any;
      setLoading(true);
      const dataUrl = await toPng(dom);
      const img = new Image();
      img.crossOrigin = "annoymous";
      img.src = dataUrl;
      img.onload = () => {
        // Initialize the PDF.
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "in",
          format: [5.5, 8.5],
        });

        // Define reused data
        const imgProps = pdf.getImageProperties(img);
        const imageType = imgProps.fileType;
        const pdfWidth = pdf.internal.pageSize.getWidth();

        // Calculate the number of pages.
        const pxFullHeight = imgProps.height;
        const pxPageHeight = Math.floor((imgProps.width * 8.5) / 5.5);
        const nPages = Math.ceil(pxFullHeight / pxPageHeight);

        // Define pageHeight separately so it can be trimmed on the final page.
        let pageHeight = pdf.internal.pageSize.getHeight();

        // Create a one-page canvas to split up the full image.
        const pageCanvas = document.createElement("canvas");
        const pageCtx = pageCanvas.getContext("2d") as any;
        pageCanvas.width = imgProps.width;
        pageCanvas.height = pxPageHeight;

        for (let page = 0; page < nPages; page++) {
          // Trim the final page to reduce file size.
          if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
            pageCanvas.height = pxFullHeight % pxPageHeight;
            pageHeight = (pageCanvas.height * pdfWidth) / pageCanvas.width;
          }
          // Display the page.
          const w = pageCanvas.width;
          const h = pageCanvas.height;
          pageCtx.fillStyle = "white";
          pageCtx.fillRect(0, 0, w, h);
          pageCtx.drawImage(img, 0, page * pxPageHeight, w, h, 0, 0, w, h);

          // Add the page to the PDF.
          if (page) pdf.addPage();

          const imgData = pageCanvas.toDataURL(`image/Rp{imageType}`, 1);
          pdf.addImage(imgData, imageType, 0, 0, pdfWidth, pageHeight);
        }
        // Output / Save
        pdf.save(`invoice-${invoiceInfo.invoiceNumber}.pdf`);
      };
      setLoading(false);
      setIsOpen(false);
    } catch (error) {
      console.error("oops, something went wrong!", error);
    }
  };
  const [invoice, setInvoice] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log(invoiceInfo.invoiceNumber);
    onSnapshot(collection(db, "invoices"), (snapshot) => {
      let items: any = [];
      snapshot.docs.map((x: any) => items.push({ ...x.data(), id: x.id }));
      const result = items.filter(
        (x) => String(x.invoiceNumber) === String(invoiceInfo.invoiceNumber)
      );
      setInvoice(result);
    });
  }, [invoiceInfo?.invoiceNumber]);

  const totalHarga = invoice.reduce((total: number, item: any) => {
    return total + Number(item.harga);
  }, 0);
  const totalBerat = invoice.reduce((total: number, item: any) => {
    return total + Number(item.kg);
  }, 0);
  const totalQtyBags = invoice.reduce((total: number, item: any) => {
    return total + Number(item.qtyBags);
  }, 0);

  const getCurrentDate = () => {
    const currentDate = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return currentDate;
  };
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="my-8 overflow-y-auto rounded-lg bg-white shadow-xl transition-all">
                <div className="p-4" id="print">
                  <img
                    className="w-full object-contain"
                    src="/header_invoice.png"
                    alt=""
                  />
                  <div className="text-center my-10 font-semibold text-[1.5rem]">
                    TANDA TERIMA PEMBAYARAN
                  </div>
                  <div className="mb-4 w-full flex items-start">
                    <span className="font-bold">Kode invoice</span>
                    <span>: &nbsp;{invoiceInfo.telahTerimaDari}</span>
                  </div>
                  <div className="mb-4 w-full flex items-start">
                    <span className="font-bold">Uang Sejumlah</span>
                    <span>
                      : &nbsp;Rp{" "}
                      {Number(invoiceInfo.uangSejumlah)
                        .toLocaleString()
                        .replaceAll(",", ".")}
                    </span>
                  </div>
                  <div className="mb-4 w-full flex items-start">
                    <span className="font-bold">Kode Invoice</span>
                    <span>: &nbsp;{invoiceInfo.invoiceNumber}</span>
                  </div>

                  <div className="mb-5 w-full flex flex-col items-start">
                    <div className="font-bold">Pembayaran Melalui : </div>
                    <div>Bank BRI No Rekening : 1186-01-000255-565</div>
                    <div>A.n CV Gumelar Putra Sejahtera</div>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-y border-black/10 text-sm md:text-base">
                          <th>No</th>
                          <th>Uraian</th>
                          <th>Jenis Truk</th>
                          <th>Lokasi Awal</th>
                          <th>Lokasi Akhir</th>
                          <th>Rate</th>
                          {/* <th>Kota</th>
                          <th>Jarak ( Dalam KM )</th> */}
                          <th>QTY Bags</th>
                          <th>Kg</th>
                          <th>Harga</th>
                          <th>Keterangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.map((item: any, index: any) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.uraian}</td>
                            <td>{item.jenisTruk}</td>
                            <td>{item.lokasi_awal.split(",")[0]}</td>
                            <td>{item.lokasi_akhir.split(",")[0]}</td>
                            <td>{item.rate}</td>
                            {/* <td>{item.kota}</td>
                            <td>{item.jarakKota}</td> */}
                            <td>{Number(item.qtyBags)}</td>
                            <td>{Number(item.kg)}</td>
                            <td>
                              Rp{" "}
                              {Number(item.harga)
                                .toLocaleString()
                                .replaceAll(",", ".")}
                            </td>
                            <td>{item.keterangan}</td>
                          </tr>
                        ))}
                        <tr>
                          {/* <td></td>
                          <td></td> */}
                          <td colSpan={6}>Jumlah</td>
                          <td>{Number(totalQtyBags)}</td>
                          <td>{Number(totalBerat)}</td>
                          <td>
                            Rp{" "}
                            {Number(totalHarga)
                              .toLocaleString()
                              .replaceAll(",", ".")}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end mt-6">
                    Bekasi , {getCurrentDate()}
                  </div>
                  <div className="flex justify-between items-center mt-5 text-center p-5">
                    <div>
                      <div>Direktur</div>
                    </div>
                    <div>
                      <div>{invoiceInfo.telahTerimaDari}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2 px-4 pb-6">
                  <Button
                    className="bg-primary"
                    sx={{ color: "white" }}
                    fullWidth={true}
                    variant="contained"
                    onClick={DownloadInvoice}
                  >
                    Download Invoice
                  </Button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black/50 z-50">
          <CircularProgress />
        </div>
      )}
    </>
  );
}
