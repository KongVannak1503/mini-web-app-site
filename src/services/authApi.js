import api from "./api";

export const LoginUser = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res;
};
export const createAuthApi = async (userData) => {
    const res = await api.post(`/auth/register`, userData);
    console.log(res);

    return res.data;
};


export const logoutUser = async () => {
    return await api.post('/auth/logout', null, { withCredentials: true });
};

