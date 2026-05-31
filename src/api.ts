/**
 * 🇹🇭 API Service Router Helper - Dual-mode Express vs PHP PDO Connector
 */

export const isPHPMode = () => {
  // If the query string forces php mode, e.g. ?backend=php
  const hasPhpParam = new URLSearchParams(window.location.search).get('backend') === 'php';
  if (hasPhpParam) return true;
  
  // If we are not running on development port 3000 or the AI Studio Sandboxed Dev Domain (*.run.app)
  const isDevEnvironment = 
    window.location.port === '3000' || 
    window.location.hostname.includes('run.app') || 
    window.location.hostname.includes('localhost') || 
    window.location.hostname.includes('127.0.0.1');
    
  return !isDevEnvironment;
};

export const getMappedUrl = (url: string): string => {
  if (!isPHPMode()) {
    return url;
  }

  // Remove any leading slash for safe relative paths
  const cleanPath = url.startsWith('/') ? url.slice(1) : url;
  
  if (cleanPath.startsWith('api/auth/register')) {
    return `obec_pa_connector.php?action=register`;
  }
  if (cleanPath.startsWith('api/auth/login')) {
    return `obec_pa_connector.php?action=login`;
  }
  if (cleanPath.startsWith('api/profile')) {
    return `obec_pa_connector.php?action=profile`;
  }
  if (cleanPath.startsWith('api/admin/teachers')) {
    const parts = cleanPath.split('/');
    if (parts.length === 3) {
      return `obec_pa_connector.php?action=admin_teachers`;
    } else if (parts.length === 5 && parts[4] === 'approve') {
      const teacherId = parts[3];
      return `obec_pa_connector.php?action=admin_approve_teacher&teacherId=${encodeURIComponent(teacherId)}`;
    } else if (parts.length === 4) {
      const teacherId = parts[3];
      return `obec_pa_connector.php?action=admin_delete_teacher&teacherId=${encodeURIComponent(teacherId)}`;
    }
  }
  if (cleanPath.startsWith('api/admin/mysql-sync')) {
    return `obec_pa_connector.php?action=admin_mysql_sync`;
  }
  if (cleanPath.startsWith('api/agreements')) {
    const parts = cleanPath.split('/');
    if (parts.length === 2) {
      return `obec_pa_connector.php?action=agreements`;
    } else if (parts.length === 3) {
      const id = parts[2];
      return `obec_pa_connector.php?action=agreement_detail&id=${encodeURIComponent(id)}`;
    } else if (parts.length === 4 && parts[3] === 'indicators') {
      const agreementId = parts[2];
      return `obec_pa_connector.php?action=indicators&agreementId=${encodeURIComponent(agreementId)}`;
    } else if (parts.length === 4 && parts[3] === 'evidence') {
      const agreementId = parts[2];
      return `obec_pa_connector.php?action=evidence&agreementId=${encodeURIComponent(agreementId)}`;
    }
  }
  if (cleanPath.startsWith('api/indicators')) {
    const parts = cleanPath.split('/');
    const indicatorId = parts[2];
    return `obec_pa_connector.php?action=update_indicator&indicatorId=${encodeURIComponent(indicatorId)}`;
  }
  if (cleanPath.startsWith('api/evidence')) {
    const parts = cleanPath.split('/');
    const id = parts[2];
    return `obec_pa_connector.php?action=delete_evidence&id=${encodeURIComponent(id)}`;
  }
  if (cleanPath.startsWith('api/copilot/chat')) {
    return `obec_pa_connector.php?action=copilot_chat`;
  }
  if (cleanPath.startsWith('api/db/mysql-dump')) {
    return `obec_pa_connector.php?action=mysql_dump`;
  }
  if (cleanPath.startsWith('api/db/php-backend')) {
    return `obec_pa_connector.php?action=php_backend`;
  }

  return url;
};

/**
 * Custom fetch wrapper supporting transparent URL mapping, content adjustment,
 * and Method Spoofing (converting PUT and DELETE to POST with a _method query param)
 * to bypass rigid hosting servers that block PUT/DELETE requests.
 */
export const apiFetch = async (url: string, init: RequestInit = {}): Promise<Response> => {
  const mappedUrl = getMappedUrl(url);
  const finalInit = { ...init };
  let finalUrl = mappedUrl;
  
  if (isPHPMode()) {
    const method = init.method?.toUpperCase();
    if (method === 'PUT' || method === 'DELETE') {
      finalInit.method = 'POST';
      // Append the real intended method for PHP backend routing
      finalUrl += (finalUrl.includes('?') ? '&' : '?') + `_method=${method}`;
    }
  }
  
  return fetch(finalUrl, finalInit);
};
