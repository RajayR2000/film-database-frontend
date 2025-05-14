// src/api/endpoints.ts
const BASE = process.env.REACT_APP_API_BASE_URL!;
if (!BASE) throw new Error('REACT_APP_API_BASE_URL not defined');

export const ENDPOINTS = {
  MOVIES_LIST:  `${BASE}/films`,
  MOVIES_FULL:  `${BASE}/films/full`,
  MOVIE_DETAILS: (id: string) => `${BASE}/films/${id}`,
  POSTER: (id: string)   => `${BASE}/poster/${id}`,
  DOCUMENT: (id: string) => `${BASE}/document/${id}`,
  LOGIN: `${BASE}/login`,
  USERS: `${BASE}/users`,
  USER: (id: number | string) => `${BASE}/users/${id}`,
  FILMS: `${BASE}/films`,
  UPLOAD_ASSETS: (id: string) => `${BASE}/upload-assets/${id}`,
  UPLOAD_DOCUMENT:(id: string) => `${BASE}/upload-document/${id}`,
};
