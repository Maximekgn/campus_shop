const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_BASE}${cleanPath}`;
  
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Detailed Request Logging
  console.group(`🚀 API Request: ${options.method || 'GET'} ${cleanPath}`);
  console.log('URL:', url);
  console.log('Headers:', headers);
  if (options.body) {
    try {
      console.log('Body:', options.body instanceof FormData ? 'FormData' : JSON.parse(options.body as string));
    } catch {
      console.log('Body:', options.body);
    }
  }
  console.groupEnd();

  try {
    const res = await fetch(url, { ...options, headers });
    
    // Detailed Response Logging
    console.group(`✅ API Response: ${res.status} ${cleanPath}`);
    console.log('Status:', res.status, res.statusText);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error Body:', errorText);
      console.groupEnd();
      throw new Error(`Error: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    console.log('Data:', data);
    console.groupEnd();
    return data;
  } catch (error) {
    console.group(`❌ API Failed: ${cleanPath}`);
    console.error('Fetch Error:', error);
    console.groupEnd();
    throw error;
  }
}

export const api = {
  get: (path: string) => request(path, { method: 'GET' }),
  
  post: (path: string, data?: unknown) => {
    const isFormData = data instanceof FormData;
    return request(path, {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? (data as FormData) : data ? JSON.stringify(data) : undefined,
    });
  },

  put: (path: string, data?: unknown) => {
    return request(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete: async (path: string) => {
    await request(path, { method: 'DELETE' });
  },
};