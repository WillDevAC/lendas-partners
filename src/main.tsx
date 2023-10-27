import App from "./App.tsx";
import ReactDOM from "react-dom/client";

import { CustomProvider } from "rsuite";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";

import "rsuite/dist/rsuite.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles/global.scss";
import "rodal/lib/rodal.css";

import Loading from "./components/Loading/index.tsx";
import ConfirmModal from "./components/ConfirmModal/index.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <CustomProvider theme="dark">
        <App />
        <Loading />
        <ConfirmModal/>
        <ToastContainer theme="dark" />
    </CustomProvider>
  </QueryClientProvider>
);
