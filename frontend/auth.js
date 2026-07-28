import apiClient from "./client";

export const registerUser = async ({ fullName, email, password }) => {
  const { data } = await apiClient.post("/auth/register", {
    full_name: fullName,
    email,
    password,
  });
  return data;
};

export const loginUser = async ({ email, password }) => {
  const { data } = await apiClient.post("/auth/login", { email, password });
  return data; // { access_token, token_type, user }
};

export const logoutUser = async () => {
  await apiClient.post("/auth/logout");
};

export const fetchCurrentUser = async () => {
  const { data } = await apiClient.get("/auth/me");
  return data;
};
