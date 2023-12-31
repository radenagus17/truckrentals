import { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  query,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "@/firebase_config";
import InvoiceField from "../invoice_tab/InvoiceField";
import PrintInvoice from "./invoicePrint";
import Swal from "sweetalert2";

export default function OrdersItem() {
  const [data, setData] = useState<any>([]);
  const [invoices, setInvoices] = useState<any>([]);
  const [lists, setLists] = useState<any>({});
  const [invoice, setInvoice] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getData = () => {
    onSnapshot(collection(db, "orders"), (snapshot) => {
      let items: any = [];
      snapshot.docs.map((x: any) => items.push({ ...x.data(), id: x.id }));
      setData(items);
    });
  };

  const getInvoices = () => {
    onSnapshot(collection(db, "invoices"), (snapshot) => {
      let items: any = [];
      snapshot.docs.map((x: any) => items.push({ ...x.data(), id: x.id }));
      setInvoices(items);
    });
  };

  useEffect(() => {
    getData();
    getInvoices();
  }, []);

  const openModalPrint = (event: any, item: any) => {
    event.preventDefault();
    setIsOpen(true);
    setLists(item);
  };

  // update status in firebase
  const updateStatus = async (item) => {
    setInvoice(item.id);
    setLoading(true);
    setTimeout(async () => {
      await updateDoc(doc(db, "orders", item.id), {
        status: item.status,
        supir: item.supir,
        platKendaraan: item.platKendaraan,
      });
      setLoading(false);
    }, 2000);
  };

  // delete order in firebase
  const deleteItem = (item) => {
    Swal.fire({
      title: "Apakah kamu yakin!",
      text: "Ingin menghapus order ini?",
      showCancelButton: true,
      cancelButtonText: "Batal",
      confirmButtonText: "Yaa",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        setLoading(true);
        setTimeout(async () => {
          await deleteDoc(doc(db, "orders", item.id));
          invoices
            .filter((items) => items.idOrder === item.id)
            .forEach(async (el) => {
              await deleteDoc(doc(db, "invoices", el.id));
            });
          setLoading(false);
          Swal.fire("Terhapus!", "", "success");
        }, 2000);
      } else if (result.isDismissed) {
        Swal.fire("Terima kasih!", "", "info");
      }
    });
  };

  const edtiItemHandler = (event: any) => {
    const editedItem = {
      id: event.target.id,
      name: event.target.name,
      value: event.target.value,
    };

    const newItems = data.map((items: any) => {
      for (const key in items) {
        if (key === editedItem.name && items.id === editedItem.id) {
          items[key] = editedItem.value;
          // items["harga"] = calculatePrice(items["kg"], items["jarakKota"]);
        }
      }
      return items;
    });

    setData(newItems);
  };
  return (
    <div className="w-full overflow-x-scroll">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black/50 z-50" />
      )}
      <table className="w-full p-4 text-left">
        <thead>
          <tr className="border-b border-gray-900/10 text-sm md:text-base">
            <th>No</th>
            <th>Tanggal Invoice</th>
            <th>Invoice Number</th>
            {/* <th>Lokasi Awal</th>
            <th>Lokasi Akhir</th>
            <th>Rate</th> */}
            <th>Total Berat</th>
            <th>Total Harga</th>
            <th>Terima Dari</th>
            <th>
              Supir <span className="text-red-500">*</span>
            </th>
            <th>
              Plat Kendaraan <span className="text-red-500">*</span>
            </th>
            <th>
              Status <span className="text-red-500">*</span>
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <>
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.invoiceDate}</td>
                <td>{item.invoiceNumber}</td>
                {/* <td>{item.lokasi_awal.slice(0, 22).concat("...")}</td>
                <td>{item.lokasi_akhir.slice(0, 22).concat("...")}</td>
                <td>{item.rate}</td> */}
                <td>{item.totalBerat} Kg</td>
                <td>
                  <div>
                    Rp.{" "}
                    {Number(item.totalPrice)
                      .toLocaleString()
                      .replaceAll(",", ".")}
                  </div>
                </td>
                <td>{item.telah_terima_dari}</td>
                <td>
                  {loading && item.id === invoice ? (
                    <div className="w-full flex items-center justify-center">
                      <CircularProgress />
                    </div>
                  ) : (
                    <InvoiceField
                      onEditItem={(event: any) => edtiItemHandler(event)}
                      cellData={{
                        type: "text",
                        name: "supir",
                        id: item.id,
                        value: item.supir,
                      }}
                    />
                  )}
                </td>
                <td>
                  {loading && item.id === invoice ? (
                    <div className="w-full flex items-center justify-center">
                      <CircularProgress />
                    </div>
                  ) : (
                    <InvoiceField
                      onEditItem={(event: any) => edtiItemHandler(event)}
                      cellData={{
                        type: "text",
                        name: "platKendaraan",
                        id: item.id,
                        value: item.platKendaraan,
                      }}
                    />
                  )}
                </td>
                <td>
                  {loading && item.id === invoice ? (
                    <div className="w-full flex items-center justify-center">
                      <CircularProgress />
                    </div>
                  ) : (
                    <select
                      className="appearance-none focus:outline-none"
                      name="status"
                      id={item.id}
                      value={item.status}
                      onChange={(e: any) => edtiItemHandler(e)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="DALAM PROSES">DALAM PROSES</option>
                      <option value="SELESAI">SELESAI</option>
                    </select>
                  )}
                </td>
                <td>
                  <div className="flex gap-2 justify-center items-center">
                    <IconButton onClick={() => updateStatus(item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={(e) => openModalPrint(e, item)}>
                      <PrintIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteItem(item)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
      <PrintInvoice
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        invoiceInfo={{
          invoiceNumber: lists.invoiceNumber,
          telahTerimaDari: lists.telah_terima_dari,
          uangSejumlah: lists.telah_dibayar,
        }}
        items={data}
      />
    </div>
  );
}
