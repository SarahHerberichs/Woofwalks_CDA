import { toast } from 'react-toastify';
import api from "./api";

export const postGenericAd = async (data, entityType) => {
  try {
    const response = await api.post(`api/${entityType}custom`, data);
    const result = response.data;

    toast.success(
      `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} créé avec succès !`,
      {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
    return result;
  } catch (error) {
    console.error("Erreur gérée par l'intercepteur.");
    throw error;
  }
};