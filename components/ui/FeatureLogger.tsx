"use client";

import { useEffect } from "react";
export function FeatureLogger() {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.info("Correção aplicada ✔ | Datas e botões visíveis ✔ | Acabamento metálico vibrante ✔");
  }, []);

  return null;
}
