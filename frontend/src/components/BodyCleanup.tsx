"use client";
import { useEffect } from "react";

export default function BodyCleanup() {
  useEffect(() => {
    try {
      // Remove known injected attributes that break hydration
      document.body.removeAttribute('data-smart-converter-loaded');
      // Remove any attribute that starts with data-smart-converter
      Array.from(document.body.attributes).forEach((attr) => {
        if (attr.name.startsWith('data-smart-converter')) {
          document.body.removeAttribute(attr.name);
        }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return null;
}
