import React from "react";

import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { toast } from "react-toastify";

function ProtectedComponent<P extends {}>(
  ComposedComponent: React.ComponentType<P>
) {
  return function (props: P) {
    const authStore = useAuthStore();

    if (authStore.getToken()) {
      return <ComposedComponent {...props} />;
    } else {
      toast.info("Desconectado.");
      return <Navigate to="/auth/login" />;
    }
  };
}

export default ProtectedComponent;
