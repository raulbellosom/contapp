import axios from 'axios';
import { saveAs } from 'file-saver';

export const BASE_API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:4000/';
export const API_URL = `${BASE_API_URL}/api` || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
});

// append access control allow origin header
api.interceptors.request.use(
  (config) => {
    config.headers['Access-Control-Allow-Origin'] = '*';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const headerFormData = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const register = async (credentials) => {
  try {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const loadUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.get('/auth/logout');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateProfile = async (profile) => {
  try {
    const response = await api.put('/auth/updateProfile', profile);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updatePassword = async (passwords) => {
  try {
    console.log(passwords);
    const response = await api.put('/auth/updatePassword', passwords);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateProfileImage = async (profileImage) => {
  try {
    let data = new FormData();
    data.append('profileImage', profileImage);
    const response = await api.put(
      '/auth/updateProfileImage',
      data,
      headerFormData,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUsers = async () => {
  const response = await api.get(`/users`);
  return response.data;
};

export const createUser = async (user) => {
  const response = await api.post(`/users`, user);
  return response.data;
};

export const updateUser = async (user) => {
  const response = await api.put(`/users/${user.id}`, user);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

export const getVehicles = async () => {
  const response = await api.get(`/vehicles`);
  return response.data;
};

export const getVehicle = async ({ id: vehicleId, signal }) => {
  const response = await api.get(`/vehicles/${vehicleId}`, { signal });
  return response.data;
};

export const createVehicle = async (vehicle) => {
  let data = new FormData();

  if (vehicle.images && vehicle.images.length > 0) {
    vehicle.images.forEach((image) => {
      data.append('images', image);
    });
  }

  if (vehicle.files && vehicle.files.length > 0) {
    vehicle.files.forEach((file) => {
      data.append('files', file);
    });
  }

  data.append('vehicle', JSON.stringify(vehicle));
  const response = await api.post(`/vehicles`, data, headerFormData);
  return response.data;
};

export const updateVehicle = async (vehicle) => {
  const id = vehicle.id;
  let data = new FormData();
  let currentImages = vehicle.images.filter((image) => image instanceof File);
  vehicle.images = vehicle.images.filter((image) => !(image instanceof File));
  let currentFiles = vehicle.files.filter((file) => file instanceof File);
  vehicle.files = vehicle.files.filter((file) => !(file instanceof File));

  if (currentImages && currentImages.length > 0) {
    currentImages.forEach((image) => {
      data.append('images', image);
    });
  }

  if (currentFiles && currentFiles.length > 0) {
    currentFiles.forEach((file) => {
      data.append('files', file);
    });
  }

  data.append('vehicle', JSON.stringify(vehicle));
  const response = await api.put(`/vehicles/${id}`, data, headerFormData);
  return response.data;
};

export const deleteVehicle = async (vehicleId) => {
  try {
    const response = await api.delete(`/vehicles/${vehicleId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchVehicles = async ({
  searchTerm,
  sortBy,
  order,
  page,
  pageSize,
  conditionName,
  deepSearch,
  signal,
}) => {
  try {
    const parsedDeepSearch = JSON.stringify(deepSearch);
    const response = await api.get('/vehicles/search', {
      params: {
        searchTerm,
        sortBy,
        order,
        page,
        pageSize,
        conditionName,
        deepSearch: parsedDeepSearch,
      },
      signal: signal,
    });
    if (response.status !== 200) {
      throw new Error(response.message || 'Hubo un error al hacer la busqueda');
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createMultipleVehicles = async (csvFile, userId) => {
  let data = new FormData();

  data.append('csvFile', csvFile);
  data.append('userId', JSON.stringify(userId));

  const response = await api.post(
    `/vehicles/createMultipleVehicles`,
    data,
    headerFormData,
  );
  return response.data;
};

export const getVehicleModels = async () => {
  const response = await api.get(`/vehicles/vehicleModels`);
  return response.data;
};

export const getVehicleModel = async (vehicleModelId) => {
  const response = await api.post(`/vehicles/vehicleModels/${vehicleModelId}`);
  return response.data;
};

export const createVehicleModel = async (vehicleModel) => {
  const response = await api.post(`/vehicles/vehicleModels`, vehicleModel);
  return response.data;
};

export const updateVehicleModel = async (vehicleModel) => {
  const response = await api.put(
    `/vehicles/vehicleModels/${vehicleModel.id}`,
    vehicleModel,
  );
  return response.data;
};

export const deleteVehicleModel = async (vehicleModelId) => {
  const response = await api.delete(
    `/vehicles/vehicleModels/${vehicleModelId}`,
  );
  return response.data;
};

export const searchModels = async ({
  searchTerm,
  sortBy,
  order,
  page,
  pageSize,
  signal,
}) => {
  try {
    const response = await api.get('/vehicles/vehicleModels/search', {
      params: {
        searchTerm,
        sortBy,
        order,
        page,
        pageSize,
      },
      signal: signal,
    });
    if (response.status !== 200) {
      throw new Error(response.message || 'Hubo un error al hacer la busqueda');
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getVehicleTypes = async () => {
  const response = await api.get(`/vehicles/vehicleTypes`);
  return response.data;
};

export const getVehicleType = async (vehicleTypeId) => {
  const response = await api.post(`/vehicles/vehicleTypes/${vehicleTypeId}`);
  return response.data;
};

export const createVehicleType = async (vehicleType) => {
  const response = await api.post(`/vehicles/vehicleTypes`, vehicleType);
  return response.data;
};

export const updateVehicleType = async (vehicleType) => {
  const response = await api.put(
    `/vehicles/vehicleTypes/${vehicleType.id}`,
    vehicleType,
  );
  return response.data;
};

export const deleteVehicleType = async (vehicleTypeId) => {
  const response = await api.delete(`/vehicles/vehicleTypes/${vehicleTypeId}`);
  return response.data;
};

export const getVehicleBrands = async () => {
  const response = await api.get(`/vehicles/vehicleBrands`);
  return response.data;
};

export const getVehicleBrand = async (vehicleBrandId) => {
  const response = await api.post(`/vehicles/vehicleBrands/${vehicleBrandId}`);
  return response.data;
};

export const createVehicleBrand = async (vehicleBrand) => {
  const response = await api.post(`/vehicles/vehicleBrands`, vehicleBrand);
  return response.data;
};

export const updateVehicleBrand = async (vehicleBrand) => {
  const response = await api.put(
    `/vehicles/vehicleBrands/${vehicleBrand.id}`,
    vehicleBrand,
  );
  return response.data;
};

export const deleteVehicleBrand = async (vehicleBrandId) => {
  const response = await api.delete(
    `/vehicles/vehicleBrands/${vehicleBrandId}`,
  );
  return response.data;
};

export const getVehicleConditions = async () => {
  const response = await api.get(`/vehicles/vehicleConditions`);
  return response.data;
};

export const getVehicleCondition = async (vehicleConditionId) => {
  const response = await api.post(
    `/vehicles/vehicleConditions/${vehicleConditionId}`,
  );
  return response.data;
};

export const createVehicleCondition = async (vehicleCondition) => {
  const response = await api.post(
    `/vehicles/vehicleConditions`,
    vehicleCondition,
  );
  return response.data;
};

export const updateVehicleCondition = async (vehicleCondition) => {
  const response = await api.put(
    `/vehicles/vehicleConditions/${vehicleCondition.id}`,
    vehicleCondition,
  );
  return response.data;
};

export const deleteVehicleCondition = async (vehicleConditionId) => {
  const response = await api.delete(
    `/vehicles/vehicleConditions/${vehicleConditionId}`,
  );
  return response.data;
};

export const downloadFile = async (file) => {
  const response = await api.get(file.url, {
    responseType: 'blob',
  });
  const fileName = `${file?.metadata?.originalname || file?.id}`;

  saveAs(response.data, fileName ?? 'file');
};

export default api;
