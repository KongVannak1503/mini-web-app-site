
import api from "./api";

export const getProductsApi = async () => {
    const res = await api.get('/products');
    return res.data;
};
export const getProductsCountApi = async () => {
    const res = await api.get('/products/count');
    return res.data;
};
export const getProductApi = async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
};

export const createProductApi = async (userData) => {
    const res = await api.post(`/products`, userData);
    return res.data;
};

export const updateProductApi = async (id, formData) => {
    const res = await api.put(`/products/${id}`, formData);
    return res.data;
};

export const deleteProductApi = async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
};
