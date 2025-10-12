import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { store } from "./app/store";
//import { apiSlice } from "@/features/api/apiSlice";

import App from "./App.tsx";

async function start() {
  //await store.dispatch(apiSlice.endpoints.getCurrentUser.initiate());

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  );
}

start();
