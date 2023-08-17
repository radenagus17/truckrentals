import { useEffect, useState, useContext, useMemo } from "react";
import { PriceContext } from "@/context/PriceContext";
import { orderBy } from "lodash";
import InvoiceField from "../invoice_tab/InvoiceField";
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { IconButton, CircularProgress } from "@mui/material";

export default function PriceItems() {
  const { rates, setRates, addRate, velocity, setVelocity, deleteRate } =
    useContext(PriceContext);
  // const [rates, setRates] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [idRate, setIdRate] = useState("");
  const [distance, setDistance] = useState(0);
  const [weight, setWeight] = useState(0);
  const [price, setPrice] = useState(0);

  useMemo(() => {
    rates.map((rate) => {
      for (const key in rate) {
        if (
          rate.id == rate[key] &&
          rate["distance_to"] > distance &&
          distance > rate["distance_from"]
        ) {
          setPrice(weight * rate["rate"]);
        }
      }
    });
  }, [distance, weight]);

  const updateRates = async (item) => {
    setIdRate(item.id);
    setLoading(true);
    setTimeout(async () => {
      await updateDoc(doc(db, "rates", item.id), {
        rate: +item.rate,
      });
      setLoading(false);
      window.location.reload();
    }, 2000);
  };

  const edtiSimulation = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    switch (name) {
      case "jarak":
        setDistance(value);
        break;
      case "beban":
        setWeight(value);
        break;

      default:
        break;
    }
  };

  const edtiItemHandler = (event: any) => {
    const editedItem = {
      id: event.target.id,
      name: event.target.name,
      value: event.target.value,
    };

    const newItems = rates.map((items: any) => {
      for (const key in items) {
        if (key === editedItem.name && items.id === editedItem.id) {
          items[key] = editedItem.value;
          // items["harga"] = calculatePrice(items["kg"], items["jarakKota"]);
        }
      }
      return items;
    });

    setRates(newItems);
  };
  return (
    <>
      <table className="w-1/2 m-auto p-4 text-left">
        <thead className="bg-green-200">
          <tr>
            <th>No</th>
            <th>Jarak Awal (Km)</th>
            <th>Jarak Akhir (Km)</th>
            <th>
              Rate <span className="text-red-400">*</span>
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rates?.length > 0 &&
            orderBy(rates, "rate", "asc").map((x, idx) => (
              <tr key={x.id}>
                <td>{idx + 1}</td>
                <td>{x.distance_from}</td>
                <td>{x.distance_to}</td>
                <td>
                  {loading && x.id === idRate ? (
                    <div className="w-full flex items-center justify-center">
                      <CircularProgress />
                    </div>
                  ) : (
                    <InvoiceField
                      onEditItem={(event: any) => edtiItemHandler(event)}
                      cellData={{
                        type: "text",
                        name: "rate",
                        id: x.id,
                        value: x.rate,
                        className: "max-w-[2rem]",
                      }}
                    />
                  )}
                </td>
                <td>
                  <div className="flex items-center justify-center gap-1">
                    <IconButton
                      color="secondary"
                      onClick={() => updateRates(x)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => deleteRate(x.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex flex-col justify-start items-center mt-7 gap-2">
        <h1 className="text-3xl font-semibold text-center">Tambah Rate</h1>
        <table className="w-full max-w-sm">
          <thead>
            <tr>
              <th>Jarak Awal (Km)</th>
              <th>Jarak Akhir (Km)</th>
              <th>Rate</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  className="outline-none text-center"
                  type="text"
                  value={velocity.distance_from}
                  onChange={(e) =>
                    setVelocity({ ...velocity, distance_from: +e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  className="outline-none text-center"
                  type="text"
                  value={velocity.distance_to}
                  onChange={(e) =>
                    setVelocity({ ...velocity, distance_to: +e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  className="outline-none text-center"
                  type="text"
                  value={velocity.rate}
                  onChange={(e) =>
                    setVelocity({ ...velocity, rate: +e.target.value })
                  }
                />
              </td>
              <td>
                <div className="flex items-center justify-center">
                  <IconButton
                    color="success"
                    type="button"
                    onClick={addRate}
                    size="small"
                  >
                    <AddIcon />
                  </IconButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex flex-col justify-center items-center mt-7 gap-2">
        <h1 className="text-3xl font-semibold">Simulasi</h1>
        <table className="min-w-[75%]">
          <thead>
            <tr>
              <th>Jarak (Km)</th>
              <th>Beban (Kg)</th>
              <th>Harga</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <InvoiceField
                  onEditItem={(event: any) => edtiSimulation(event)}
                  cellData={{
                    type: "number",
                    name: "jarak",
                    value: distance,
                    className: "w-full text-center",
                  }}
                />
              </td>
              <td>
                <InvoiceField
                  onEditItem={(event: any) => edtiSimulation(event)}
                  cellData={{
                    type: "number",
                    name: "beban",
                    value: weight,
                    className: "w-full text-center",
                  }}
                />
              </td>
              <td className="w-64 text-center">
                Rp. {price.toLocaleString().replaceAll(",", ".")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
