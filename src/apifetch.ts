// apiFetch.ts
export async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const response = await fetch(input, init);
    if (response.status === 401) {
      // Token expired; clear token and notify the app.
      localStorage.removeItem('accessToken');
      // Dispatch a custom event so UI can respond
      window.dispatchEvent(new CustomEvent('tokenExpired'));
      // Optionally, you can throw an error or return response.
      throw new Error('Token expired');
    }
    return response;
  }
  