import React, { createContext, useState, useContext } from "react";
import CustomSnackBar from "../utils/SnackBar";

const SnackContext = createContext();

export const useSnack = () => useContext(SnackContext);

export const SnackProvider = ({ children }) => {
  const [snack, setSnack] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showSnack = (type, message) => {
    setSnack({
      visible: true,
      type,
      message,
    });
  };

  const hideSnack = () => {
    setSnack({ ...snack, visible: false });
  };

  return (
    <SnackContext.Provider value={{ showSnack }}>
      {children}

      {/* global snackbar */}
      <CustomSnackBar
        visible={snack.visible}
        message={snack.message}
        type={snack.type}
        onDismiss={hideSnack}
      />
    </SnackContext.Provider>
  );
};
