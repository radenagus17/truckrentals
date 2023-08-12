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

  function getRates() {
    onSnapshot(collection(db, "rates"), (snapshot) => {
      let items: any = [];
      snapshot.docs.map((x: any) => items.push({ ...x.data(), id: x.id }));
      setRates(items);
      setLists(items);
    });
  }

  useEffect(() => {
    getRates();
  }, []);

  return (
    <PriceContext.Provider value={{ lists, setLists, rates, setRates }}>
      {children}
    </PriceContext.Provider>
  );
};

export default PriceProvider;
