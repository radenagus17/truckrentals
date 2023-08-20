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

interface ListOfRates {
  id: string;
  distance_from: number;
  distance_to: number;
  rate: number;
}
interface Rates {
  id: string;
  distance_from: number;
  distance_to: number;
  rate: number;
}

interface Velocity {
  distance_from: number;
  distance_to: number;
  rate: number;
}

interface MyContextType {
  lists: ListOfRates[];
  rates: Rates[];
  velocity: Velocity;
  setLists: React.Dispatch<React.SetStateAction<ListOfRates[]>>;
  setRates: React.Dispatch<React.SetStateAction<Rates[]>>;
  setVelocity: React.Dispatch<React.SetStateAction<Velocity>>;
  addRate: () => void;
  deleteRate: (id: string) => void;
}

// create price context
export const PriceContext = createContext<MyContextType | undefined>(undefined);

const PriceProvider = ({ children }) => {
  const [lists, setLists] = useState<any>([]);
  const [rates, setRates] = useState<any>([]);
  const [velocity, setVelocity] = useState({
    distance_from: 0,
    distance_to: 0,
    rate: 0,
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
      item["distance_from"] = 0;
      item["distance_to"] = 0;
      item["rate"] = 0;
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
