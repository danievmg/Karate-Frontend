export function createPageUrl(path, params = {}) {
  if (!path) return "/";
  
  // O SEGREDO TÁ AQUI: Garante que toda rota comece com "/"
  let url = path.startsWith('/') ? path : `/${path}`;
  
  if (params && typeof params === 'object') {
    Object.keys(params).forEach((key) => {
      url = url.replace(`:${key}`, params[key]);
    });
  }
  
  return url;
}