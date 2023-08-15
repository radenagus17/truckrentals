import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Download";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "@/firebase_config";
import { toast } from "react-toastify";

function AddService() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({
    jenisTruk: "CDD",
    bebanMuatan: 0,
    selisihJarak: 0,
  });

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

  const inputHandler = (e: any) => {
    setInputData((prevState) => {
      return {
        ...prevState,
        [e.target.name]: Number(e.target.value),
      };
    });
  };

  const submitHandler = async () => {
    if (inputData.jenisTruk && inputData.bebanMuatan > 0 && file !== null) {
      setLoading(true);
      try {
        const storageRef = ref(
          storage,
          `/services/${file.name.split(".")[0] + Date.now()}`
        );
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        await addDoc(collection(db, "services"), {
          jenisTruk: inputData.jenisTruk,
          bebanMuatan: inputData.bebanMuatan,
          imageUrl: url,
        });
        toast("Data Berhasil Ditambahkan");
        setInputData({
          jenisTruk: "CDD",
          bebanMuatan: 0,
          selisihJarak: 0,
        });
        setFile(null);
        setLoading(false);
      } catch (error) {
        toast("Input Valid Data");
        setLoading(false);
      }
    }
  };

  const deleteHandler = async (id: string, imageUrl: string) => {
    try {
      await deleteObject(ref(storage, imageUrl));
      await deleteDoc(doc(db, "services", id));
    } catch (error) {
      toast(error.message);
    }
  };

  return (
    <div className="flex flex-col space-y-5">
      <label htmlFor="file">
        <div className="p-5 border-2 border-dashed border-primary flex justify-center items-center h-[20rem] flex-col space-y-3">
          {file !== null ? (
            <img src={URL.createObjectURL(file)} alt="" />
          ) : (
            <>
              <UploadIcon fontSize="large" />
              <div>Upload Gambar Truk</div>
            </>
          )}
        </div>
      </label>
      <input
        onChange={(e) => {
          if (e.target.files !== null) {
            setFile(e.target.files[0]);
          }
        }}
        type="file"
        id="file"
        hidden
      />
      <FormControl fullWidth>
        <InputLabel sx={{ background: "white" }}>Jenis Truk</InputLabel>
        <Select
          name="jenisTruk"
          label="Jenis Truk"
          onChange={inputHandler}
          value={inputData.jenisTruk}
        >
          <MenuItem value="CDD">CDD</MenuItem>
          <MenuItem value="Fuso">Fuso</MenuItem>
          <MenuItem value="Wingbox">Wingbox</MenuItem>
        </Select>
      </FormControl>
      {loading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <Button
          onClick={submitHandler}
          variant="contained"
          className="bg-primary"
          sx={{ color: "white" }}
        >
          Buat Jasa
        </Button>
      )}

      <div className="text-[1.5rem] font-semibold text-primary text-center">
        Daftar Jasa
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 mt-10 gap-5">
        {data?.map((x: any) => {
          return (
            <div key={x.imageUrl} className="bg-white drop-shadow-lg border">
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
                  onClick={() => deleteHandler(x.id, x.imageUrl)}
                  color="error"
                  variant="contained"
                  className="bg-red-500"
                  fullWidth={true}
                  sx={{ color: "white", marginTop: 1 }}
                >
                  Hapus Jasa
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AddService;
