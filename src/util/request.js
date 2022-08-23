import config from '@/config';

function showErrorAlert(err) {
  if (err && err.response && err.response.data) {
    err = err.response;
  }
  alert(err?.message || err?.msg || err?.data?.msg || 'net work error');
}

const defaultOptions = {
  method: 'GET',
  url: '',
  data: '',
  params: '',
  headers: {},
  host: config.CONFIG_API_HOST,
  resultTargetCode: 0,
  resultTargetStatus: 200,
  validResult: true,
  takeInnerData: true,
  showError: true,
  useSession: true,
  showErrorAction: showErrorAlert,
};

export function originRequest(options) {
  const { method, host, url, headers, params, data } = options;
  return new Promise((resolve, reject) => {
    let uri = host + url;

    if (params && typeof params === 'object') {
      const s = new URLSearchParams();
      for (let key in params) {
        s.append(key, params[key]);
      }
      uri += '?' + s.toString();
    }

    const fetchOption = {
      cache: 'no-cache',
      redirect: 'follow',
      referrerPolicy: 'no-referrer-when-downgrade',
      method,
      headers: {
        ...headers,
      },
    };

    if (method === 'POST') {
      fetchOption.headers['content-type'] = 'application/json';
      fetchOption.body = JSON.stringify(data);
    }

    fetch(uri, fetchOption)
      .then((res) => {
        if (res.status < 200 || res.status > 207) {
          throw res;
        }
        const responseContentType = res.headers.get('Content-Type') || res.headers.get('content-type') || '';
        let responseData;
        if (responseContentType.indexOf('json') > -1) {
          responseData = res.json();
        } else {
          responseData = res.text();
        }
        resolve(responseData);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

export function get(options) {
  return originRequest({
    ...defaultOptions,
    ...options,
    method: 'GET',
  });
}

export function post(options) {
  return originRequest({
    ...defaultOptions,
    ...options,
    method: 'POST',
  });
}
