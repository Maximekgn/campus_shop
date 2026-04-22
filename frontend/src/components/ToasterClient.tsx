"use client";
import { Toaster } from "react-hot-toast";

export default function ToasterClient() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "16px",
          padding: "12px 16px",
        },
        success: {
          style: {
            background: "#ECFDF5",
            color: "#065F46",
            border: "1px solid #A7F3D0",
          },
        },
        error: {
          style: {
            background: "#FEF2F2",
            color: "#991B1B",
            border: "1px solid #FECACA",
          },
        },
      }}
    />
  );
}
