interface ClientResponse<T> {
  status: number;
  data: T | null;
  headers: Headers;
  url: string;
}

export async function client<T>(
  endpoint: string,
  body: string | null | object = null,
  { ...customConfig }: Partial<RequestInit> = {}
): Promise<ClientResponse<T>> {
  const token = await client.getXsrfToken();
  const headers = {
    //{ [k: string]: string }
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "X-xsrf-token": token,
  };

  // const xsrfCookie = client.getCookie('XSRF-TOKEN')
  // console.log(xsrfCookie)
  // if (xsrfCookie) {
  //   headers['X-xsrf-token'] = xsrfCookie
  // }

  endpoint = import.meta.env.VITE_APP_BACKEND_URL + endpoint;

  const config: RequestInit = {
    method: body ? "POST" : "GET",
    credentials: "include",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await window.fetch(endpoint, config);
    const result = {
      status: response.status,
      data: null,
      headers: response.headers,
      url: response.url,
    };
    if (response.status !== 204) {
      result.data = await response.json();
    }

    if (response.ok) {
      return result;
    } else if ([419, 420, 422].includes(response.status)) {
      return Promise.reject(result);
    }
    throw new Error(response.statusText);
  } catch (err: unknown) {
    let msg = "";
    if (err instanceof Error) {
      msg = err.message;
    } else if (typeof err === "string") {
      msg = err;
    }
    return Promise.reject(msg);
  }
}

client.get = function <T>(
  endpoint: string,
  customConfig: Partial<RequestInit> = {}
) {
  return client<T>(endpoint, null, { ...customConfig });
};

client.post = function <T>(
  endpoint: string,
  body: string | null | object,
  customConfig: Partial<RequestInit> = {}
) {
  return client<T>(endpoint, body, { ...customConfig });
};

client.getCookie = function (name: string) {
  const regex = new RegExp(`(^| )${name}=([^;]+)`);
  const decodedCookie = decodeURIComponent(document.cookie);
  const match = decodedCookie.match(regex);
  return match ? match[2] : null;
};

let xsrfCookie: string | null = null;

client.getXsrfToken = async function (
  noCache: boolean = false
): Promise<string> {
  if (xsrfCookie == null || noCache) {
    await client.fetchXsrf();
    xsrfCookie = client.getCookie("XSRF-TOKEN");
    if (xsrfCookie == null) {
      throw new Error("failed to get xsrf token");
    }
  }

  return xsrfCookie!;
};

client.fetchXsrf = async function () {
  return window.fetch(
    import.meta.env.VITE_APP_BACKEND_URL + "/sanctum/csrf-cookie",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "include",
    }
  );
};
