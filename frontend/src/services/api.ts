const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_BASE}${cleanPath}`;
  
  const headers = {
    'Accept': 'application/json',
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
      console.warn('Error Body:', errorText);
      console.groupEnd();
      if (res.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        document.cookie = 'auth_role=;path=/;max-age=0';
        window.location.href = '/login';
        return new Promise(() => {});
      }

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {}
      
      const err = new Error(errorData?.message || `Error: ${res.status} - ${errorText}`);
      (err as any).status = res.status;
      (err as any).data = errorData;
      throw err;
    }

    const data = await res.json();
    console.log('Data:', data);
    console.groupEnd();
    return data;
  } catch (error) {
    console.group(`❌ API Failed: ${cleanPath}`);
    console.warn('Fetch Error:', error);
    try {
      if (typeof window !== 'undefined') {
        console.log('Navigator online:', typeof navigator !== 'undefined' ? navigator.onLine : 'unknown');
      }
    } catch (e) {
      // ignore
    }
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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...(data as any || {}), _method: 'PUT' }),
    });
  },

  delete: async (path: string) => {
    return request(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _method: 'DELETE' }),
    });
  },
};