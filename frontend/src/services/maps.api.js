import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/';
const API_URL = `${BASE_API_URL}/api` || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    config.headers['Access-Control-Allow-Origin'] = '*';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

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

export const getMaps = async () => {
  try {
    const { data } = await api.get('/maps');
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getMapById = async (id) => {
  try {
    const { data } = await api.get(`/maps/${id}`);
    return data;
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const createMap = async (map) => {
  try {
    const { data } = await api.post('/maps', map);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateMap = async (map) => {
  try {
    const { data } = await api.put(`/maps/${map.id}`, map);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteMap = async (id) => {
  try {
    const { data } = await api.delete(`/maps/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// layers

export const getLayers = async (id) => {
  try {
    const { data } = await api.get(`/layers/mapId/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getLayerById = async (id) => {
  try {
    const { data } = await api.get(`/layers/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createLayer = async (layer) => {
  try {
    const formData = new FormData();
    const image = layer?.image[0] || null;

    if (image instanceof File) {
      formData.append('image', image);
    }

    formData.append(
      'layerData',
      JSON.stringify({
        name: layer.name,
        mapId: layer.mapId,
        order: layer.order,
        type: 'map',
      }),
    );

    const { data } = await api.post('/layers', formData, headerFormData);

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateLayer = async (layer) => {
  try {
    const formData = new FormData();
    const image = layer?.image[0] || null;

    if (image instanceof File) {
      formData.append('image', image);
    }

    formData.append(
      'layerData',
      JSON.stringify({
        name: layer.name,
        order: layer.order,
        mapId: layer.mapId,
        type: 'map',
      }),
    );

    const { data } = await api.put(
      `/layers/${layer.id}`,
      formData,
      headerFormData,
    );

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateLayersOrder = async (layers) => {
  try {
    const { data } = await api.put('/layers/order', layers);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteLayer = async (id) => {
  try {
    const { data } = await api.delete(`/layers/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};