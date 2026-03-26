import axiosClient from './axiosClient';

export const login = async (email, password) => {
  const { data } = await axiosClient.post('/auth/login', { email, password });
  return data;
};

export const register = async ({ Nombre, Email, PasswordHash, RolNombre }) => {
  const { data } = await axiosClient.post('/usuarios', { Nombre, Email, PasswordHash, RolNombre });
  return data;
};

export const loginConGoogle = async (googleToken) => {
  const { data } = await axiosClient.post('/auth/google', { googleToken });
  return data;
};

export const solicitarCodigoRecuperacion = async (email) => {
  const { data } = await axiosClient.post('/auth/recuperar', { email });
  return data;
};

export const verificarCodigoRecuperacion = async (email, codigo) => {
  const { data } = await axiosClient.post('/auth/verificar-codigo', { email, codigo });
  return data;
};

export const cambiarPassword = async (email, codigo, nuevaPassword) => {
  const { data } = await axiosClient.post('/auth/cambiar-password', { email, codigo, nuevaPassword });
  return data;
};