// src/api/endpoints.ts
const BASE = process.env.REACT_APP_API_BASE_URL!;
if (!BASE) throw new Error('REACT_APP_API_BASE_URL not defined');

export const ENDPOINTS = {
  MOVIES_LIST:  `${BASE}/films`,
  MOVIES_FULL:  `${BASE}/films/full`,
  MOVIE_DETAILS: (id: string) => `${BASE}/films/${id}`,
  DOCUMENT: (id: string) => `${BASE}/document/${id}`,
  LOGIN: `${BASE}/login`,
  USERS: `${BASE}/users`,
  USER: (id: number | string) => `${BASE}/users/${id}`,
  FILMS: `${BASE}/films`,
  UPLOAD_DOCUMENT:(id: string) => `${BASE}/upload-document/${id}`,
  FILM_POSTER: (filmId: string) => `${BASE}/films/${filmId}/poster`, // POST (upload/replace poster), DELETE (poster)
  FILM_GALLERY_IMAGES_ALL: (filmId: string) => `${BASE}/films/${filmId}/gallery_images`, // POST (upload one gallery image)
  FILM_GALLERY_IMAGE_SPECIFIC: (galleryImageId: string) => `${BASE}/films/gallery_images/${galleryImageId}`, // DELETE (specific gallery image by its own ID)
};
