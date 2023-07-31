"use client";

import { Button, IconButton } from "@mui/material";
import InvoiceField from "./InvoiceField";
import DeleteIcon from "@mui/icons-material/Delete";

const InvoiceItem = ({
  id,
  uraian,
  jenisTruk,
  kota,
  jarakKota,
  qtyBags,
  kg,
  harga,
  keterangan,
  onDeleteItem,
  onEditItem,
  index,
}: any) => {
  const deleteItemHandler = () => {
    onDeleteItem(id);
  };

  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        <InvoiceField
          onEditItem={(event: any) => onEditItem(event)}
          cellData={{
            type: "text",
            name: "uraian",
            id: id,
            value: uraian,
          }}
        />
      </td>
      <td>
        <InvoiceField
          onEditItem={(event: any) => onEditItem(event)}
          cellData={{
            type: "text",
            name: "jenisTruk",
            id: id,
            value: jenisTruk,
          }}
        />
      </td>
      <td>
        <InvoiceField
          onEditItem={(event: any) => onEditItem(event)}
          cellData={{
            type: "text",
            name: "kota",
            id: id,
            value: kota,
          }}
        />
      </td>
      <td>
        <InvoiceField
          onEditItem={(event: any) => onEditItem(event)}
          cellData={{
            type: "number",
            name: "jarakKota",
            id: id,
            value: jarakKota,
          }}
        />
      </td>
      <td>
        <InvoiceField
          onEditItem={(event: any) => onEditItem(event)}
          cellData={{
            type: "number",
            name: "qtyBags",
            id: id,
            value: qtyBags,
          }}
        />
      </td>
      <td>
        <InvoiceField
          onEditItem={(event: any) => onEditItem(event)}
          cellData={{
            type: "number",
            name: "kg",
            id: id,
            value: kg,
          }}
        />
      </td>
      <td>
        <div>Rp. {Number(harga).toLocaleString().replaceAll(",", ".")}</div>
      </td>
      <td>
        <InvoiceField
          onEditItem={(event: any) => onEditItem(event)}
          cellData={{
            type: "text",
            name: "keterangan",
            id: id,
            value: keterangan,
          }}
        />
      </td>
      <td>
        <div className="flex justify-center items-center">
          <IconButton onClick={deleteItemHandler}>
            <DeleteIcon />
          </IconButton>
        </div>
      </td>
    </tr>
  );
};

export default InvoiceItem;
