const ENDPOINT = '/data/mock/{{SLUG}}/items.php';

async function request(url, { method = 'GET', body, params, signal } = {}) {
  const target = new URL(url, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') target.searchParams.set(key, value);
    });
  }

  const headers = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const response = await fetch(target, {
    method,
    headers,
    signal,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) throw new Error(`HTTP ${response.status} loading ${url}`);
  return response.json();
}

export class {{CLASS_NAME}}Service {
  getAll(options = {}) {
    return request(ENDPOINT, options);
  }

  request(url, options = {}) {
    return request(url, options);
  }
}