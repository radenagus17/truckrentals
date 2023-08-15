"use client";

import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InvoiceForm from "./invoice_tab/InvoiceForm";
import AddService from "./service_tab/add_service";
import Navigation from "../layout/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import OrdersItem from "./orders_tab/ordersItem";
import PriceItems from "./price_tab/price_items";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <div>{children}</div>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function AdminTab() {
    const [value, setValue] = React.useState(0);
    const auth = getAuth();
    const router = useRouter();

    React.useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/");
                toast("Anda Harus Login Terlebih Dahulu !");
            }
        });
    }, []);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div>
            <Navigation />
            <div className="max-w-[1200px] mx-auto">
                <Box sx={{ width: "100%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs value={value} onChange={handleChange}>
                            <Tab label="Form Invoice" {...a11yProps(0)} />
                            {/* <Tab label="Tambah Jasa Sewa" {...a11yProps(1)} /> */}
                            <Tab label="Daftar Order" {...a11yProps(1)} />
                            <Tab label="Daftar Harga" {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <InvoiceForm toTab={setValue} tab={value} />
                    </TabPanel>
                    {/* <TabPanel value={value} index={1}>
            <AddService />
          </TabPanel> */}
                    <TabPanel value={value} index={1}>
                        <OrdersItem />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <PriceItems />
                    </TabPanel>
                </Box>
            </div>
        </div>
    );
}
