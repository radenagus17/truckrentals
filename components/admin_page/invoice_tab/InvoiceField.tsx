"use client";

const InvoiceField = ({ onEditItem, cellData }: any) => {
  return (
    <input
      className={cellData.className}
      type={cellData.type}
      placeholder={cellData.placeholder}
      min={cellData.min}
      max={cellData.max}
      step={cellData.step}
      name={cellData.name}
      id={cellData.id}
      value={cellData.value}
      onChange={onEditItem}
      required
      style={{ outline: "none" }}
    />
  );
};

export default InvoiceField;
