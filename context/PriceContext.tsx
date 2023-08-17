import { useState, createContext, useEffect } from "react";
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

// create price context
export const PriceContext = createContext();

const PriceProvider = ({ children }) => {
  const [lists, setLists] = useState<any>([]);
  const [rates, setRates] = useState<any>([]);
  const [velocity, setVelocity] = useState({
    distance_from: "",
    distance_to: "",
    rate: "",
  });

  useEffect(() => {
    getRates();
  }, []);

  async function addRate() {
    // e.preventDefault();

    await addDoc(collection(db, "rates"), {
      distance_from: velocity.distance_from,
      distance_to: velocity.distance_to,
      rate: velocity.rate,
    });

    setVelocity((prev) => {
      let item = { ...prev };
      item["distance_from"] = "";
      item["distance_to"] = "";
      item["rate"] = "";
      return item;
    });
  }

  function getRates() {
    onSnapshot(collection(db, "rates"), (snapshot) => {
      let items: any = [];
      snapshot.docs.map((x: any) => items.push({ ...x.data(), id: x.id }));
      setRates(items);
      setLists(items);
    });
  }

  // delete rate in firebase
  const deleteRate = async (id) => {
    await deleteDoc(doc(db, "rates", id));
  };

  return (
    <PriceContext.Provider
      value={{
        lists,
        setLists,
        rates,
        setRates,
        velocity,
        setVelocity,
        addRate,
        deleteRate,
      }}
    >
      {children}
    </PriceContext.Provider>
  );
};

export default PriceProvider;
