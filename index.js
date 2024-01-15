import React from "react";
import { createRoot } from "react-dom/client";
import Teste from "./src/teste";

const containerTeste = document.getElementById("teste");
const root = containerTeste && createRoot(containerTeste);


if (root) {
  root.render(<Teste/>)
}
