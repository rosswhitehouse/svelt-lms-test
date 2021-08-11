var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// .svelte-kit/netlify/entry.js
__export(exports, {
  handler: () => handler
});

// node_modules/@sveltejs/kit/dist/install-fetch.js
var import_http = __toModule(require("http"));
var import_https = __toModule(require("https"));
var import_zlib = __toModule(require("zlib"));
var import_stream = __toModule(require("stream"));
var import_util = __toModule(require("util"));
var import_crypto = __toModule(require("crypto"));
var import_url = __toModule(require("url"));
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
var dataUriToBuffer$1 = src;
var { Readable } = import_stream.default;
var wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
var Blob = class {
  constructor(blobParts = [], options2 = {}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const { size } = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], { type: String(type).toLowerCase() });
    Object.assign(wm.get(blob), { size: span, parts: blobParts });
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
};
Object.defineProperties(Blob.prototype, {
  size: { enumerable: true },
  type: { enumerable: true },
  slice: { enumerable: true }
});
var fetchBlob = Blob;
var Blob$1 = fetchBlob;
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
var isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
var carriage = "\r\n";
var dashes = "-".repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
var INTERNALS$2 = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (import_util.types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_stream.default)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = import_stream.default.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_stream.default) {
      body.on("error", (err) => {
        const error3 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error3;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new Blob$1([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
};
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true }
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error3) {
    if (error3 instanceof FetchBaseError) {
      throw error3;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error3.message}`, "system", error3);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error3) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error3.message}`, "system", error3);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_stream.PassThrough({ highWaterMark });
    p2 = new import_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof import_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
var writeToStream = (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
var validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw err;
  }
};
var validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
    throw err;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = { enumerable: true };
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol("Response internals");
var Response = class extends Body {
  constructor(body = null, options2 = {}) {
    super(body, options2);
    const status = options2.status || 200;
    const headers = new Headers(options2.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options2.url,
      status,
      statusText: options2.statusText || "",
      headers,
      counter: options2.counter,
      highWaterMark: options2.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
var INTERNALS = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
var Request = class extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return (0, import_url.format)(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};
var supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = dataUriToBuffer$1(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error3 = new AbortError("The operation was aborted.");
      reject(error3);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error3);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error3);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error3) {
                reject(error3);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
        reject(error3);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error3) => {
          reject(error3);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
          reject(error3);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error3) => {
              reject(error3);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error3) => {
              reject(error3);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error3) => {
          reject(error3);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}

// node_modules/@sveltejs/kit/dist/adapter-utils.js
function isContentTypeTextual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}

// node_modules/@sveltejs/kit/dist/ssr.js
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
async function render_endpoint(request, route) {
  const mod = await route.load();
  const handler2 = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler2) {
    return;
  }
  const match = route.pattern.exec(request.path);
  if (!match) {
    return error("could not parse parameters from request path");
  }
  const params = route.params(match);
  const response = await handler2({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = headers["content-type"];
  const is_type_textual = isContentTypeTextual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s2 = subscribers[i];
          s2[1]();
          subscriber_queue.push(s2, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error3,
  page
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error3) {
    error3.stack = options2.get_stack(error3);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error4) => {
      throw new Error(`Failed to serialize session data: ${error4.message}`);
    })},
				host: ${page && page.host ? s$1(page.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error3)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page && page.host ? s$1(page.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page && page.path)},
						query: new URLSearchParams(${page ? s$1(page.query.toString()) : ""}),
						params: ${page && s$1(page.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n			")}
		`.replace(/^\t{2}/gm, "");
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error3) {
  if (!error3)
    return null;
  let serialized = try_serialize(error3);
  if (!serialized) {
    const { name, message, stack } = error3;
    serialized = try_serialize({ ...error3, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error3 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error3 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error3}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error3 };
    }
    return { status, error: error3 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page,
  node,
  $session,
  context,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error3
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  const page_proxy = new Proxy(page, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module2.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d2) => d2.file === filename || d2.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? {
              "content-type": asset.type
            } : {}
          }) : await fetch(`http://${page.host}/${asset.file}`, opts);
        } else if (resolved.startsWith(options2.paths.base || "/") && !resolved.startsWith("//")) {
          const relative = resolved.replace(options2.paths.base, "");
          const headers = { ...opts.headers };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body,
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.serverFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers[key2] = value;
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error3;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped) {
      result += escaped[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base, path) {
  const base_match = absolute.exec(base);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base}"`);
  }
  const baseparts = path_match ? [] : base.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function coalesce_to_error(err) {
  return err instanceof Error ? err : new Error(JSON.stringify(err));
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error3 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page,
    node: default_layout,
    $session,
    context: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page,
      node: default_error,
      $session,
      context: loaded ? loaded.context : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error3
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error3,
      branch,
      page
    });
  } catch (err) {
    const error4 = coalesce_to_error(err);
    options2.handle_error(error4);
    return {
      status: 500,
      headers: {},
      body: error4.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error4 = coalesce_to_error(err);
    options2.handle_error(error4);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error4
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error3;
  ssr:
    if (page_config.ssr) {
      let context = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              context,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({ status, error: error3 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e);
            status = 500;
            error3 = e;
          }
          if (loaded && !error3) {
            branch.push(loaded);
          }
          if (error3) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node({
                    ...opts,
                    node: error_node,
                    context: node_loaded.context,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error3
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error3
            });
          }
        }
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      ...opts,
      page_config,
      status,
      error: error3,
      branch: branch.filter(Boolean)
    });
  } catch (err) {
    const error4 = coalesce_to_error(err);
    options2.handle_error(error4);
    return await respond_with_error({
      ...opts,
      status: 500,
      error: error4
    });
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
async function render_page(request, route, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const match = route.pattern.exec(request.path);
  const params = route.params(match);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  #map;
  constructor(map) {
    this.#map = map;
  }
  get(key) {
    const value = this.#map.get(key);
    return value && value[0];
  }
  getAll(key) {
    return this.#map.get(key);
  }
  has(key) {
    return this.#map.has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of this.#map)
      yield key;
  }
  *values() {
    for (const [, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
function parse_body(raw, headers) {
  if (!raw || typeof raw !== "string")
    return raw;
  const [type, ...directives] = headers["content-type"].split(/;\s*/);
  switch (type) {
    case "text/plain":
      return raw;
    case "application/json":
      return JSON.parse(raw);
    case "application/x-www-form-urlencoded":
      return get_urlencoded(raw);
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(raw, boundary.slice("boundary=".length));
    }
    default:
      throw new Error(`Invalid Content-Type ${type}`);
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: encodeURI(path + (q ? `?${q}` : ""))
        }
      };
    }
  }
  try {
    const headers = lowercase_keys(incoming.headers);
    return await options2.hooks.handle({
      request: {
        ...incoming,
        headers,
        body: parse_body(incoming.rawBody, headers),
        params: {},
        locals: {}
      },
      resolve: async (request) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        for (const route of options2.manifest.routes) {
          if (!route.pattern.test(request.path))
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request, route) : await render_page(request, route, options2, state);
          if (response) {
            if (response.status === 200) {
              if (!/(no-store|immutable)/.test(response.headers["cache-control"])) {
                const etag = `"${hash(response.body || "")}"`;
                if (request.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request);
        return await respond_with_error({
          request,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}

// .svelte-kit/output/server/app.js
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
Promise.resolve();
var escaped2 = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape2(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped2[match]);
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape2(value)) : `"${value}"`}`}`;
}
function afterUpdate() {
}
var css$5 = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n</style>"],"names":[],"mappings":"AAsDC,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$5);
  {
    stores.page.set(page);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
function set_paths(paths) {
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="/favicon.png" />\n		<link rel="stylesheet" href="/reset.css">\n		<link rel="stylesheet" href="/style.css">\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		' + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
var options = null;
var default_settings = { paths: { "base": "", "assets": "/." } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: "/./_app/start-7356559b.js",
      css: ["/./_app/assets/start-a8cd1609.css"],
      js: ["/./_app/start-7356559b.js", "/./_app/chunks/vendor-7881e17d.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => "/./_app/" + entry_lookup[id],
    get_stack: (error22) => String(error22),
    handle_error: (error22) => {
      if (error22.frame) {
        console.error(error22.frame);
      }
      console.error(error22.stack);
      error22.stack = options.get_stack(error22);
    },
    hooks: get_hooks(user_hooks),
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var d = decodeURIComponent;
var empty = () => ({});
var manifest = {
  assets: [{ "file": ".DS_Store", "size": 6148, "type": null }, { "file": "ex-how-to-install-your-tracking-code/.DS_Store", "size": 6148, "type": null }, { "file": "ex-how-to-install-your-tracking-code/Archive.zip", "size": 5364544, "type": "application/zip" }, { "file": "ex-how-to-install-your-tracking-code/adlcp_rootv1p2.xsd", "size": 4398, "type": "application/xml" }, { "file": "ex-how-to-install-your-tracking-code/analytics-frame.html", "size": 4072, "type": "text/html" }, { "file": "ex-how-to-install-your-tracking-code/html5/data/css/output.min.css", "size": 383166, "type": "text/css" }, { "file": "ex-how-to-install-your-tracking-code/html5/data/js/5XecWF4uogR.js", "size": 40172, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/data/js/5YoYspuzhxD.js", "size": 12456, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/data/js/5hXvIFR6Upi.js", "size": 11435, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/data/js/5irwqCHSaK4.js", "size": 35209, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/data/js/5xVD8nVLpf2.js", "size": 45245, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/data/js/61Ttb2nMsF7.js", "size": 32271, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/data/js/65UYYAnQ0b2.js", "size": 47110, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/data/js/66rH4Eej0tx.js", "size": 18629, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/data/js/6PwlxDOuTXI.js", "size": 16519, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/data/js/6RY8k5TmCPQ.js", "size": 22703, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/data/js/6Wbg70ZW6G0.js", "size": 27970, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/data/js/6YorOgufgU4.js", "size": 12171, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/data/js/6ao50X0tI2e.js", "size": 12208, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/data/js/6kbbx0dLukO.js", "size": 23067, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/data/js/6lvjSVGH6bW.js", "size": 21874, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/data/js/data.js", "size": 56910, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/data/js/frame.js", "size": 63061, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/data/js/paths.js", "size": 76821, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/lib/scripts/bootstrapper.min.js", "size": 747873, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/lib/scripts/frame.desktop.min.js", "size": 264154, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/lib/scripts/frame.mobile.min.js", "size": 274841, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/lib/scripts/slides.min.js", "size": 892833, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/html5/lib/stylesheets/desktop.min.css", "size": 101630, "type": "text/css" }, { "file": "ex-how-to-install-your-tracking-code/html5/lib/stylesheets/mobile-fonts/open-sans-bold.woff", "size": 21028, "type": "font/woff" }, { "file": "ex-how-to-install-your-tracking-code/html5/lib/stylesheets/mobile-fonts/open-sans-light.woff", "size": 20848, "type": "font/woff" }, { "file": "ex-how-to-install-your-tracking-code/html5/lib/stylesheets/mobile-fonts/open-sans-regular.woff", "size": 20248, "type": "font/woff" }, { "file": "ex-how-to-install-your-tracking-code/html5/lib/stylesheets/mobile.min.css", "size": 107045, "type": "text/css" }, { "file": "ex-how-to-install-your-tracking-code/ims_xml.xsd", "size": 1213, "type": "application/xml" }, { "file": "ex-how-to-install-your-tracking-code/imscp_rootv1p1p2.xsd", "size": 14560, "type": "application/xml" }, { "file": "ex-how-to-install-your-tracking-code/imsmanifest.xml", "size": 10183, "type": "application/xml" }, { "file": "ex-how-to-install-your-tracking-code/imsmd_rootv1p2p1.xsd", "size": 22196, "type": "application/xml" }, { "file": "ex-how-to-install-your-tracking-code/index_lms.html", "size": 6620, "type": "text/html" }, { "file": "ex-how-to-install-your-tracking-code/lms/AICCComm.html", "size": 31335, "type": "text/html" }, { "file": "ex-how-to-install-your-tracking-code/lms/blank.html", "size": 1191, "type": "text/html" }, { "file": "ex-how-to-install-your-tracking-code/lms/browsersniff.js", "size": 10584, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/lms/goodbye.html", "size": 278, "type": "text/html" }, { "file": "ex-how-to-install-your-tracking-code/lms/scormdriver.js", "size": 1120524, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/meta.xml", "size": 795, "type": "application/xml" }, { "file": "ex-how-to-install-your-tracking-code/mobile/5a4g1HColXS_80_DX762_DY762_CX796_CY449.png", "size": 102488, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/5hRe8clvmdj_DX4096_DY4096_CX2048_CY1153.jpg", "size": 191379, "type": "image/jpeg" }, { "file": "ex-how-to-install-your-tracking-code/mobile/5izVOHLNgIV_80_DX420_DY420_CX438_CY136.png", "size": 27379, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/5mVy0aWzUuG_80_DX294_DY294_CX298_CY102.png", "size": 12751, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/5u3WA1nw6IC_80_DX46_DY46_CX48_CY48.png", "size": 1588, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/5v7ZQddpcAx_80_DX222_DY222_CX231_CY46.png", "size": 7883, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/613rBxu2PsG_80_DX46_DY46_CX47_CY48.png", "size": 1346, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/619I3oHSgUo_80_DX606_DY606_CX589_CY635.png", "size": 53524, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/63jSzcf3IHt_80_DX208_DY208_CX215_CY62.png", "size": 9433, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/67296FgPxwv_80_DX26_DY26_CX26_CY27.png", "size": 551, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/6AGtjAZ8Atk_80_DX440_DY440_CX447_CY169.png", "size": 15556, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/6AywYtU61XP_80_DX846_DY846_CX886_CY499.png", "size": 82819, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/6CNbZW6vMW7_80_DX46_DY46_CX47_CY48.png", "size": 1361, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/6CxaLgcMLBp_80_DX46_DY46_CX47_CY48.png", "size": 1514, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/6CxaLgcMLBp_80_Q2000000_DX46_DY46_CX47_CY48.png", "size": 1321, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/6EfwwfIXZVa_80_DX266_DY266_CX279_CY215.png", "size": 7470, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/6FFA9q0Kqf8_80_DX328_DY328_CX94_CY344.png", "size": 18497, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/6GycFd5LEwP_DX4096_DY4096_CX2048_CY1153.jpg", "size": 152740, "type": "image/jpeg" }, { "file": "ex-how-to-install-your-tracking-code/mobile/6HSh4UVKH5x_DX4096_DY4096_CX2048_CY1153.jpg", "size": 156212, "type": "image/jpeg" }, { "file": "ex-how-to-install-your-tracking-code/mobile/6IMoml6ZZw6_80_DX130_DY130_CX136_CY26.png", "size": 3250, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/6Nj8TEySWIK_80_DX598_DY598_CX625_CY440.png", "size": 131202, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/6QdtIqoyT6P_80_DX128_DY128_CX103_CY41.png", "size": 2363, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/6RFR7l0Diwn_80_DX130_DY130_CX136_CY26.png", "size": 4310, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/6Sti2xuCII5_80_DX46_DY46_CX47_CY48.png", "size": 1321, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/6Tc90meKjAn_80_DX46_DY46_CX47_CY48.png", "size": 1328, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/6cR1y2ZLz6r_80_DX46_DY46_CX47_CY48.png", "size": 1360, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/6dOvHfF4vvi_80_DX290_DY290_CX284_CY130.png", "size": 9033, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/6gub5ladB2j_80_DX202_DY202_CX204_CY60.png", "size": 8910, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/6mpyQZN6Fww_80_DX566_DY566_CX593_CY417.png", "size": 120488, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/6n5vt4vRVXK_80_DX26_DY26_CX26_CY27.png", "size": 500, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/6og11Ow6YUY_DX4096_DY4096_CX2048_CY1153.jpg", "size": 254854, "type": "image/jpeg" }, { "file": "ex-how-to-install-your-tracking-code/mobile/Shape5dMmu7a2T3R.png", "size": 183, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/Shape5eQ8jayLF1V.png", "size": 199, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/Shape5hVe57BqSSb.png", "size": 157, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/Shape5v8rO0Dpptt.png", "size": 160, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/Shape5xpCmD8c1gD.png", "size": 199, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/Shape5yIf8m3YVs9.png", "size": 135, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/Shape60ZhU4kcEUg.png", "size": 143, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/Shape61QcMTAGCSY.png", "size": 199, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/Shape6MGHrnFQ3PE.png", "size": 199, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/Shape6NjOQYVBTUA.png", "size": 225, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/Shape6PK0TyjNqs2.png", "size": 183, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/Shape6T4PoZcDJz4.png", "size": 135, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/Shape6U2b34YwlUJ.png", "size": 183, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/Shape6XNdif234iA.png", "size": 143, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/Shape6aGvDUZ9Qxt.png", "size": 199, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/Shape6c5CPozDeea.png", "size": 157, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/Shape6oyIcfGl16N.png", "size": 183, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/mobile/poster_5dIJFX6rSFU_video_6PVqKgpNTJ0_22_48_502x270.jpg", "size": 53270, "type": "image/jpeg" }, { "file": "ex-how-to-install-your-tracking-code/mobile/poster_5eAr0fM24NF_video_5uRNjerBMmm_22_48_508x286.jpg", "size": 36269, "type": "image/jpeg" }, { "file": "ex-how-to-install-your-tracking-code/mobile/poster_5yFrwSo41U3_video_69mfkXakQYq_0_48_3120x1760.jpg", "size": 202102, "type": "image/jpeg" }, { "file": "ex-how-to-install-your-tracking-code/mobile/poster_5zHUPpmm8D7_video_6Zhd5JO8W6z_22_48_638x360.jpg", "size": 256221, "type": "image/jpeg" }, { "file": "ex-how-to-install-your-tracking-code/mobile/poster_60LkTyD7J8S_video_6VapiNrUgy7_22_48_504x284.jpg", "size": 44448, "type": "image/jpeg" }, { "file": "ex-how-to-install-your-tracking-code/mobile/poster_6EbKAVdmudS_video_6VapiNrUgy7_22_48_504x284.jpg", "size": 44448, "type": "image/jpeg" }, { "file": "ex-how-to-install-your-tracking-code/mobile/poster_6U3nCLGpNaU_video_6pR0bhub7zP_0_48_3120x1760.jpg", "size": 164934, "type": "image/jpeg" }, { "file": "ex-how-to-install-your-tracking-code/mobile/poster_6Z5i4enmvcF_video_5bIrmprtgxV_0_48_3120x1760.jpg", "size": 162225, "type": "image/jpeg" }, { "file": "ex-how-to-install-your-tracking-code/mobile/poster_6ecgPzoFk48_video_5dAm3hRisvJ_0_48_3120x1760.jpg", "size": 271200, "type": "image/jpeg" }, { "file": "ex-how-to-install-your-tracking-code/story.html", "size": 6563, "type": "text/html" }, { "file": "ex-how-to-install-your-tracking-code/story_content/5V5Fhdbh463_44100_48_0.mp3", "size": 200121, "type": "audio/mpeg" }, { "file": "ex-how-to-install-your-tracking-code/story_content/5VlE3XW1Kk4_44100_48_0.mp3", "size": 136644, "type": "audio/mpeg" }, { "file": "ex-how-to-install-your-tracking-code/story_content/5YQOOsDiLjM_44100_48_0.mp3", "size": 93385, "type": "audio/mpeg" }, { "file": "ex-how-to-install-your-tracking-code/story_content/5jUzrtPofsU_44100_48_0.mp3", "size": 55142, "type": "audio/mpeg" }, { "file": "ex-how-to-install-your-tracking-code/story_content/5jm7TeCtXlG_44100_48_0.mp3", "size": 105453, "type": "audio/mpeg" }, { "file": "ex-how-to-install-your-tracking-code/story_content/5qqeouxNopu_44100_48_0.mp3", "size": 110469, "type": "audio/mpeg" }, { "file": "ex-how-to-install-your-tracking-code/story_content/5seW1oOOboe_44100_48_0.mp3", "size": 205450, "type": "audio/mpeg" }, { "file": "ex-how-to-install-your-tracking-code/story_content/63fmFyfnfQI_44100_48_0.mp3", "size": 37117, "type": "audio/mpeg" }, { "file": "ex-how-to-install-your-tracking-code/story_content/693K9K9g8dY_44100_48_0.mp3", "size": 17212, "type": "audio/mpeg" }, { "file": "ex-how-to-install-your-tracking-code/story_content/6GULT34CDPe_44100_48_0.mp3", "size": 85705, "type": "audio/mpeg" }, { "file": "ex-how-to-install-your-tracking-code/story_content/6grTlwN58SF_44100_48_0.mp3", "size": 67053, "type": "audio/mpeg" }, { "file": "ex-how-to-install-your-tracking-code/story_content/6l1XQpn8JdN_44100_48_0.mp3", "size": 73323, "type": "audio/mpeg" }, { "file": "ex-how-to-install-your-tracking-code/story_content/MouseClickSound_24bdbb00-a9a6-4546-bc3b-72085d505a11_44100_48_0.mp3", "size": 2664, "type": "audio/mpeg" }, { "file": "ex-how-to-install-your-tracking-code/story_content/mouse_72826378-f378-413c-b5dc-0b00be463de3.png", "size": 283, "type": "image/png" }, { "file": "ex-how-to-install-your-tracking-code/story_content/thumbnail.jpg", "size": 18201, "type": "image/jpeg" }, { "file": "ex-how-to-install-your-tracking-code/story_content/user.js", "size": 67, "type": "application/javascript" }, { "file": "ex-how-to-install-your-tracking-code/story_content/video_5bIrmprtgxV_0_48_3120x1760.mp4", "size": 39182, "type": "video/mp4" }, { "file": "ex-how-to-install-your-tracking-code/story_content/video_5dAm3hRisvJ_0_48_3120x1760.mp4", "size": 94271, "type": "video/mp4" }, { "file": "ex-how-to-install-your-tracking-code/story_content/video_5uRNjerBMmm_22_48_508x286.mp4", "size": 43728, "type": "video/mp4" }, { "file": "ex-how-to-install-your-tracking-code/story_content/video_69mfkXakQYq_0_48_3120x1760.mp4", "size": 97035, "type": "video/mp4" }, { "file": "ex-how-to-install-your-tracking-code/story_content/video_6PVqKgpNTJ0_22_48_502x270.mp4", "size": 133048, "type": "video/mp4" }, { "file": "ex-how-to-install-your-tracking-code/story_content/video_6VapiNrUgy7_22_48_504x284.mp4", "size": 63195, "type": "video/mp4" }, { "file": "ex-how-to-install-your-tracking-code/story_content/video_6Zhd5JO8W6z_22_48_638x360.mp4", "size": 305114, "type": "video/mp4" }, { "file": "ex-how-to-install-your-tracking-code/story_content/video_6pR0bhub7zP_0_48_3120x1760.mp4", "size": 51606, "type": "video/mp4" }, { "file": "favicon.png", "size": 1571, "type": "image/png" }, { "file": "reset.css", "size": 1092, "type": "text/css" }, { "file": "style.css", "size": 91, "type": "text/css" }],
  layout: ".svelte-kit/build/components/layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: [".svelte-kit/build/components/layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/courses\/?$/,
      params: empty,
      a: [".svelte-kit/build/components/layout.svelte", "src/routes/courses/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/courses\/([^/]+?)\/?$/,
      params: (m) => ({ id: d(m[1]) }),
      a: [".svelte-kit/build/components/layout.svelte", "src/routes/courses/[id].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  serverFetch: hooks.serverFetch || fetch
});
var module_lookup = {
  ".svelte-kit/build/components/layout.svelte": () => Promise.resolve().then(function() {
    return layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error2;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index$1;
  }),
  "src/routes/courses/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/courses/[id].svelte": () => Promise.resolve().then(function() {
    return _id_;
  })
};
var metadata_lookup = { ".svelte-kit/build/components/layout.svelte": { "entry": "/./_app/layout.svelte-b942f5d5.js", "css": [], "js": ["/./_app/layout.svelte-b942f5d5.js", "/./_app/chunks/vendor-7881e17d.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "/./_app/error.svelte-ab3bbe53.js", "css": [], "js": ["/./_app/error.svelte-ab3bbe53.js", "/./_app/chunks/vendor-7881e17d.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "/./_app/pages/index.svelte-6f074a78.js", "css": ["/./_app/assets/pages/index.svelte-715ebf17.css", "/./_app/assets/Footer-fee3c7f6.css"], "js": ["/./_app/pages/index.svelte-6f074a78.js", "/./_app/chunks/vendor-7881e17d.js", "/./_app/chunks/Footer-b569bcfb.js"], "styles": [] }, "src/routes/courses/index.svelte": { "entry": "/./_app/pages/courses/index.svelte-5dbef813.js", "css": [], "js": ["/./_app/pages/courses/index.svelte-5dbef813.js", "/./_app/chunks/vendor-7881e17d.js"], "styles": [] }, "src/routes/courses/[id].svelte": { "entry": "/./_app/pages/courses/[id].svelte-32c9ca1c.js", "css": ["/./_app/assets/pages/courses/[id].svelte-44e0f0db.css", "/./_app/assets/Footer-fee3c7f6.css"], "js": ["/./_app/pages/courses/[id].svelte-32c9ca1c.js", "/./_app/chunks/vendor-7881e17d.js", "/./_app/chunks/Footer-b569bcfb.js"], "styles": [] } };
async function load_component(file) {
  return {
    module: await module_lookup[file](),
    ...metadata_lookup[file]
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
var Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${slots.default ? slots.default({}) : ``}`;
});
var layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Layout
});
function load$1({ error: error22, status }) {
  return { props: { error: error22, status } };
}
var Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error22 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error22 !== void 0)
    $$bindings.error(error22);
  return `<h1>${escape2(status)}</h1>

<pre>${escape2(error22.message)}</pre>



${error22.frame ? `<pre>${escape2(error22.frame)}</pre>` : ``}
${error22.stack ? `<pre>${escape2(error22.stack)}</pre>` : ``}`;
});
var error2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load: load$1
});
var css$4 = {
  code: "header.svelte-yar2wg.svelte-yar2wg{padding:50px;display:flex}header.svelte-yar2wg img.svelte-yar2wg{max-width:300px}",
  map: '{"version":3,"file":"Header.svelte","sources":["Header.svelte"],"sourcesContent":["<header>\\n    <a href=\\"/\\">\\n        <img src=\\"https://learning.hotjar.com/wp-content/uploads/2021/07/Hotjar-learning-logo.png\\" alt=\\"Hotjar Learning\\" />\\n    </a>\\n</header>\\n\\n<style>\\n    header {\\n        padding: 50px;\\n        display: flex;\\n    }\\n\\n    header img {\\n        max-width: 300px;\\n    }\\n</style>"],"names":[],"mappings":"AAOI,MAAM,4BAAC,CAAC,AACJ,OAAO,CAAE,IAAI,CACb,OAAO,CAAE,IAAI,AACjB,CAAC,AAED,oBAAM,CAAC,GAAG,cAAC,CAAC,AACR,SAAS,CAAE,KAAK,AACpB,CAAC"}'
};
var Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$4);
  return `<header class="${"svelte-yar2wg"}"><a href="${"/"}"><img src="${"https://learning.hotjar.com/wp-content/uploads/2021/07/Hotjar-learning-logo.png"}" alt="${"Hotjar Learning"}" class="${"svelte-yar2wg"}"></a>
</header>`;
});
var css$3 = {
  code: "section.svelte-43va19{display:flex;background:linear-gradient(180deg, #7A7A7A 0%, #F8F8F8 100%)}h1.svelte-43va19{font-size:64px;margin-bottom:50px}h3.svelte-43va19{font-size:24px;margin-bottom:50px}a.svelte-43va19{background:#FD3A5C;font-size:18px;padding:20px 40px;-webkit-border-radius:5px;border-radius:5px}img.svelte-43va19{max-width:100%}",
  map: `{"version":3,"file":"Hero.svelte","sources":["Hero.svelte"],"sourcesContent":["<section>\\n    <div class=\\"text\\">\\n        <h1>Grow your knowledge and collect the right insights</h1>\\n        <h3>With over 1200 courses in 18 subjects, you're guaranteed to find something that's right for you.\\n        </h3>\\n        <a href=\\"/courses\\">Get Started</a>\\n    </div>\\n    <div class=\\"img\\">\\n        <img src=\\"https://learning.hotjar.com/wp-content/uploads/2021/07/Manage-growing-pm-team.png\\" alt=\\"\\">\\n    </div>\\n</section>\\n\\n<style>\\n    section {\\n        display: flex;\\n        background: linear-gradient(180deg, #7A7A7A 0%, #F8F8F8 100%);\\n    }\\n    h1 {\\n        font-size: 64px;\\n        margin-bottom: 50px;\\n    }\\n    h3 {\\n        font-size: 24px;\\n        margin-bottom: 50px;\\n    }\\n    a {\\n        background: #FD3A5C;\\n        font-size: 18px;\\n        padding: 20px 40px;\\n        -webkit-border-radius: 5px;\\n        border-radius: 5px;\\n    }\\n    img {\\n        max-width: 100%;\\n    }\\n</style>"],"names":[],"mappings":"AAaI,OAAO,cAAC,CAAC,AACL,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,gBAAgB,MAAM,CAAC,CAAC,OAAO,CAAC,EAAE,CAAC,CAAC,OAAO,CAAC,IAAI,CAAC,AACjE,CAAC,AACD,EAAE,cAAC,CAAC,AACA,SAAS,CAAE,IAAI,CACf,aAAa,CAAE,IAAI,AACvB,CAAC,AACD,EAAE,cAAC,CAAC,AACA,SAAS,CAAE,IAAI,CACf,aAAa,CAAE,IAAI,AACvB,CAAC,AACD,CAAC,cAAC,CAAC,AACC,UAAU,CAAE,OAAO,CACnB,SAAS,CAAE,IAAI,CACf,OAAO,CAAE,IAAI,CAAC,IAAI,CAClB,qBAAqB,CAAE,GAAG,CAC1B,aAAa,CAAE,GAAG,AACtB,CAAC,AACD,GAAG,cAAC,CAAC,AACD,SAAS,CAAE,IAAI,AACnB,CAAC"}`
};
var Hero = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$3);
  return `<section class="${"svelte-43va19"}"><div class="${"text"}"><h1 class="${"svelte-43va19"}">Grow your knowledge and collect the right insights</h1>
        <h3 class="${"svelte-43va19"}">With over 1200 courses in 18 subjects, you&#39;re guaranteed to find something that&#39;s right for you.
        </h3>
        <a href="${"/courses"}" class="${"svelte-43va19"}">Get Started</a></div>
    <div class="${"img"}"><img src="${"https://learning.hotjar.com/wp-content/uploads/2021/07/Manage-growing-pm-team.png"}" alt="${""}" class="${"svelte-43va19"}"></div>
</section>`;
});
var css$2 = {
  code: ".courses.svelte-163t18m.svelte-163t18m{display:flex;justify-content:space-between}.courseCard.svelte-163t18m.svelte-163t18m{padding:20px;border:1px solid #e0e0e0;width:20%}h2.svelte-163t18m.svelte-163t18m{font-size:50px;text-align:center;margin-bottom:50px}h5.svelte-163t18m a.svelte-163t18m{color:inherit}",
  map: '{"version":3,"file":"RecentCourses.svelte","sources":["RecentCourses.svelte"],"sourcesContent":["<section>\\n    <h2>Recent Courses</h2>\\n    <div class=\\"courses\\">\\n        <div class=\\"courseCard\\">\\n            <h5><a href=\\"/courses/ex-how-to-install-your-tracking-code\\">Course Name</a></h5>\\n            <hr>\\n            <p>More Info</p>\\n        </div>\\n        <div class=\\"courseCard\\">\\n            <h5>Course Name</h5>\\n            <hr>\\n            <p>More Info</p>\\n        </div>\\n        <div class=\\"courseCard\\">\\n            <h5>Course Name</h5>\\n            <hr>\\n            <p>More Info</p>\\n        </div>\\n        <div class=\\"courseCard\\">\\n            <h5>Course Name</h5>\\n            <hr>\\n            <p>More Info</p>\\n        </div>\\n    </div>\\n</section>\\n\\n\\n<style>\\n    .courses {\\n        display: flex;\\n        justify-content: space-between;\\n    }\\n    .courseCard {\\n        padding: 20px;\\n        border: 1px solid #e0e0e0;\\n        width: 20%;\\n    }\\n    h2 {\\n        font-size: 50px;\\n        text-align: center;\\n        margin-bottom: 50px;\\n    }\\n    h5 a {\\n        color: inherit;\\n    }\\n</style>"],"names":[],"mappings":"AA4BI,QAAQ,8BAAC,CAAC,AACN,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,aAAa,AAClC,CAAC,AACD,WAAW,8BAAC,CAAC,AACT,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,OAAO,CACzB,KAAK,CAAE,GAAG,AACd,CAAC,AACD,EAAE,8BAAC,CAAC,AACA,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,MAAM,CAClB,aAAa,CAAE,IAAI,AACvB,CAAC,AACD,iBAAE,CAAC,CAAC,eAAC,CAAC,AACF,KAAK,CAAE,OAAO,AAClB,CAAC"}'
};
var RecentCourses = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `<section><h2 class="${"svelte-163t18m"}">Recent Courses</h2>
    <div class="${"courses svelte-163t18m"}"><div class="${"courseCard svelte-163t18m"}"><h5 class="${"svelte-163t18m"}"><a href="${"/courses/ex-how-to-install-your-tracking-code"}" class="${"svelte-163t18m"}">Course Name</a></h5>
            <hr>
            <p>More Info</p></div>
        <div class="${"courseCard svelte-163t18m"}"><h5>Course Name</h5>
            <hr>
            <p>More Info</p></div>
        <div class="${"courseCard svelte-163t18m"}"><h5>Course Name</h5>
            <hr>
            <p>More Info</p></div>
        <div class="${"courseCard svelte-163t18m"}"><h5>Course Name</h5>
            <hr>
            <p>More Info</p></div></div>
</section>`;
});
var css$1 = {
  code: "footer.svelte-2h957z.svelte-2h957z.svelte-2h957z{background-color:#263346;padding:30px 0}img.svelte-2h957z.svelte-2h957z.svelte-2h957z{max-width:75px;margin:55px auto 0}footer.svelte-2h957z>div.svelte-2h957z.svelte-2h957z:first-of-type{display:flex}footer.svelte-2h957z>div.svelte-2h957z:first-of-type>div.svelte-2h957z{width:19%}footer.svelte-2h957z>div.svelte-2h957z>div.svelte-2h957z:first-of-type{width:19%;text-align:center}h2.svelte-2h957z.svelte-2h957z.svelte-2h957z{color:white;font-size:14px;margin:15px 0;line-height:38px}a.svelte-2h957z.svelte-2h957z.svelte-2h957z{color:#5d708a;font-size:15px}.copyright.svelte-2h957z.svelte-2h957z.svelte-2h957z{color:#5d708a;padding-left:19%;padding-top:30px}",
  map: '{"version":3,"file":"Footer.svelte","sources":["Footer.svelte"],"sourcesContent":["<footer class=\\"footer\\">\\n    <div>\\n        <div class=\\"logo\\">\\n        <a title=\\"Home\\" href=\\"/hc/en-us\\">\\n                <img src=\\"https://theme.zdassets.com/theme_assets/1911667/590ef0f0d048850c7f87d1a4cfb3a8b860062b98.png\\" alt=\\"Logo\\">\\n        </a>\\n        </div>\\n        <div class=\\"column\\">\\n            <h2>HOTJAR</h2>\\n            <ul>\\n                <li><a href=\\"https://www.hotjar.com/tour\\">Product Tour</a></li>\\n                <li><a href=\\"https://www.hotjar.com/pricing\\">Pricing</a></li>\\n                <li><a href=\\"https://www.hotjar.com/customers/\\">Customer Stories</a></li>\\n                <li><a href=\\"https://www.hotjar.com/updates\\">Product updates</a></li>\\n                <li><a href=\\"https://www.hotjar.com/blog/what-is-hotjar/\\">What is Hotjar?</a></li>\\n                <li><a href=\\"https://status.hotjar.com/\\">Status</a></li>\\n                <li><a href=\\"https://help.hotjar.com/hc/en-us/articles/115009335727-Will-Hotjar-Slow-Down-My-Site-\\">Site performance</a></li>\\n                <li><a href=\\"https://www.hotjar.com/privacy/\\">Your privacy &amp; Hotjar</a></li>\\n            </ul>\\n            </div>\\n            <div class=\\"column\\">\\n            <h2>RESOURCES</h2>\\n            <ul>\\n                <li><a href=\\"https://www.hotjar.com/blog\\">Blog</a></li>\\n                <li><a href=\\"https://www.hotjar.com/guides/\\">Guides</a></li>\\n                <li><a href=\\"https://help.hotjar.com/hc/en-us\\">Documentation</a></li>\\n                <li><a href=\\"https://www.hotjar.com/heatmaps/\\">Heatmap handbook</a></li>\\n                <li><a href=\\"https://www.hotjar.com/conversion-rate-optimization/\\">CRO action plan</a></li>\\n                <li><a href=\\"https://www.hotjar.com/customer-experience/\\">CX resources</a></li>\\n                <li><a href=\\"https://www.hotjar.com/usability-testing/\\">Usability testing hub</a></li>\\n                <li><a href=\\"https://www.hotjar.com/blog/website-feedback/\\">Website feedback 101</a></li>\\n            </ul>\\n            </div>\\n            <div class=\\"column\\">\\n            <h2>COMPLIANCE</h2>\\n            <ul>\\n                <li><a href=\\"https://help.hotjar.com/hc/en-us/categories/360003405813\\">Compliance, legal &amp; security</a></li>\\n                <li><a href=\\"https://www.hotjar.com/legal/policies/terms-of-service\\">Terms of service</a></li>\\n                <li><a href=\\"https://www.hotjar.com/legal/policies/privacy\\">Privacy policy</a></li>\\n                <li><a href=\\"https://www.hotjar.com/legal/policies/acceptable-use/\\">Acceptable use policy</a></li>\\n                <li><a href=\\"https://help.hotjar.com/hc/en-us/articles/115011789248\\">Cookie info</a></li>\\n                <li><a href=\\"https://www.hotjar.com/privacy/do-not-track/\\">Do not track</a></li>\\n            </ul>\\n            </div>\\n            <div class=\\"column\\">\\n            <h2>COMPANY</h2>\\n            <ul>\\n                <li><a href=\\"https://www.hotjar.com/about-us/\\">About us</a></li>\\n                <li><a href=\\"https://careers.hotjar.com/\\">Careers</a></li>\\n                <li><a href=\\"https://www.hotjar.com/founding-members/\\">Founding members</a></li>\\n                <li id=\\"footercontactus\\"><a href=\\"https://help.hotjar.com/hc/en-us/requests/new?footer\\">Contact Us</a></li>\\n            </ul>\\n        </div>\\n    \\n    </div>\\n    <div class=\\"copyright\\">\\n        <p>Copyright \xA9 2014 - 2021 Hotjar Ltd. All rights reserved.</p>\\n    </div>\\n  \\n  \\n  </footer>\\n\\n  <style>\\n      footer {\\n        background-color: #263346;\\n        padding: 30px 0;\\n      }\\n      img {\\n          max-width: 75px;\\n          margin: 55px auto 0;\\n      }\\n\\n      footer > div:first-of-type {\\n        display: flex;\\n      }\\n      footer > div:first-of-type > div {\\n          width: 19%;\\n      }\\n\\n      footer > div > div:first-of-type {\\n          width: 19%;\\n          text-align: center;\\n\\n      }\\n      h2 {\\n          color: white;\\n          font-size: 14px;\\n          margin: 15px 0;\\n          line-height: 38px;\\n      }\\n      a {\\n          color: #5d708a;\\n          font-size: 15px;\\n        }\\n    .copyright {\\n        color: #5d708a;\\n        padding-left: 19%;\\n        padding-top:30px;\\n      }\\n  </style>"],"names":[],"mappings":"AA+DM,MAAM,0CAAC,CAAC,AACN,gBAAgB,CAAE,OAAO,CACzB,OAAO,CAAE,IAAI,CAAC,CAAC,AACjB,CAAC,AACD,GAAG,0CAAC,CAAC,AACD,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,IAAI,CAAC,IAAI,CAAC,CAAC,AACvB,CAAC,AAED,oBAAM,CAAG,+BAAG,cAAc,AAAC,CAAC,AAC1B,OAAO,CAAE,IAAI,AACf,CAAC,AACD,oBAAM,CAAG,iBAAG,cAAc,CAAG,GAAG,cAAC,CAAC,AAC9B,KAAK,CAAE,GAAG,AACd,CAAC,AAED,oBAAM,CAAG,iBAAG,CAAG,iBAAG,cAAc,AAAC,CAAC,AAC9B,KAAK,CAAE,GAAG,CACV,UAAU,CAAE,MAAM,AAEtB,CAAC,AACD,EAAE,0CAAC,CAAC,AACA,KAAK,CAAE,KAAK,CACZ,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,IAAI,CAAC,CAAC,CACd,WAAW,CAAE,IAAI,AACrB,CAAC,AACD,CAAC,0CAAC,CAAC,AACC,KAAK,CAAE,OAAO,CACd,SAAS,CAAE,IAAI,AACjB,CAAC,AACL,UAAU,0CAAC,CAAC,AACR,KAAK,CAAE,OAAO,CACd,YAAY,CAAE,GAAG,CACjB,YAAY,IAAI,AAClB,CAAC"}'
};
var Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<footer class="${"footer svelte-2h957z"}"><div class="${"svelte-2h957z"}"><div class="${"logo svelte-2h957z"}"><a title="${"Home"}" href="${"/hc/en-us"}" class="${"svelte-2h957z"}"><img src="${"https://theme.zdassets.com/theme_assets/1911667/590ef0f0d048850c7f87d1a4cfb3a8b860062b98.png"}" alt="${"Logo"}" class="${"svelte-2h957z"}"></a></div>
        <div class="${"column svelte-2h957z"}"><h2 class="${"svelte-2h957z"}">HOTJAR</h2>
            <ul><li><a href="${"https://www.hotjar.com/tour"}" class="${"svelte-2h957z"}">Product Tour</a></li>
                <li><a href="${"https://www.hotjar.com/pricing"}" class="${"svelte-2h957z"}">Pricing</a></li>
                <li><a href="${"https://www.hotjar.com/customers/"}" class="${"svelte-2h957z"}">Customer Stories</a></li>
                <li><a href="${"https://www.hotjar.com/updates"}" class="${"svelte-2h957z"}">Product updates</a></li>
                <li><a href="${"https://www.hotjar.com/blog/what-is-hotjar/"}" class="${"svelte-2h957z"}">What is Hotjar?</a></li>
                <li><a href="${"https://status.hotjar.com/"}" class="${"svelte-2h957z"}">Status</a></li>
                <li><a href="${"https://help.hotjar.com/hc/en-us/articles/115009335727-Will-Hotjar-Slow-Down-My-Site-"}" class="${"svelte-2h957z"}">Site performance</a></li>
                <li><a href="${"https://www.hotjar.com/privacy/"}" class="${"svelte-2h957z"}">Your privacy &amp; Hotjar</a></li></ul></div>
            <div class="${"column svelte-2h957z"}"><h2 class="${"svelte-2h957z"}">RESOURCES</h2>
            <ul><li><a href="${"https://www.hotjar.com/blog"}" class="${"svelte-2h957z"}">Blog</a></li>
                <li><a href="${"https://www.hotjar.com/guides/"}" class="${"svelte-2h957z"}">Guides</a></li>
                <li><a href="${"https://help.hotjar.com/hc/en-us"}" class="${"svelte-2h957z"}">Documentation</a></li>
                <li><a href="${"https://www.hotjar.com/heatmaps/"}" class="${"svelte-2h957z"}">Heatmap handbook</a></li>
                <li><a href="${"https://www.hotjar.com/conversion-rate-optimization/"}" class="${"svelte-2h957z"}">CRO action plan</a></li>
                <li><a href="${"https://www.hotjar.com/customer-experience/"}" class="${"svelte-2h957z"}">CX resources</a></li>
                <li><a href="${"https://www.hotjar.com/usability-testing/"}" class="${"svelte-2h957z"}">Usability testing hub</a></li>
                <li><a href="${"https://www.hotjar.com/blog/website-feedback/"}" class="${"svelte-2h957z"}">Website feedback 101</a></li></ul></div>
            <div class="${"column svelte-2h957z"}"><h2 class="${"svelte-2h957z"}">COMPLIANCE</h2>
            <ul><li><a href="${"https://help.hotjar.com/hc/en-us/categories/360003405813"}" class="${"svelte-2h957z"}">Compliance, legal &amp; security</a></li>
                <li><a href="${"https://www.hotjar.com/legal/policies/terms-of-service"}" class="${"svelte-2h957z"}">Terms of service</a></li>
                <li><a href="${"https://www.hotjar.com/legal/policies/privacy"}" class="${"svelte-2h957z"}">Privacy policy</a></li>
                <li><a href="${"https://www.hotjar.com/legal/policies/acceptable-use/"}" class="${"svelte-2h957z"}">Acceptable use policy</a></li>
                <li><a href="${"https://help.hotjar.com/hc/en-us/articles/115011789248"}" class="${"svelte-2h957z"}">Cookie info</a></li>
                <li><a href="${"https://www.hotjar.com/privacy/do-not-track/"}" class="${"svelte-2h957z"}">Do not track</a></li></ul></div>
            <div class="${"column svelte-2h957z"}"><h2 class="${"svelte-2h957z"}">COMPANY</h2>
            <ul><li><a href="${"https://www.hotjar.com/about-us/"}" class="${"svelte-2h957z"}">About us</a></li>
                <li><a href="${"https://careers.hotjar.com/"}" class="${"svelte-2h957z"}">Careers</a></li>
                <li><a href="${"https://www.hotjar.com/founding-members/"}" class="${"svelte-2h957z"}">Founding members</a></li>
                <li id="${"footercontactus"}"><a href="${"https://help.hotjar.com/hc/en-us/requests/new?footer"}" class="${"svelte-2h957z"}">Contact Us</a></li></ul></div></div>
    <div class="${"copyright svelte-2h957z"}"><p>Copyright \xA9 2014 - 2021 Hotjar Ltd. All rights reserved.</p></div>
  
  
  </footer>`;
});
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Header, "Header").$$render($$result, {}, {}, {})}
${validate_component(Hero, "Hero").$$render($$result, {}, {}, {})}
${validate_component(RecentCourses, "RecentCourses").$$render($$result, {}, {}, {})}
${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}`;
});
var index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
var Courses = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<h1>ALL COURSES</h1>`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Courses
});
var css = {
  code: "h1.svelte-1gzncvq{font-size:50px;text-align:center;margin-bottom:50px}",
  map: '{"version":3,"file":"[id].svelte","sources":["[id].svelte"],"sourcesContent":["<script context=\\"module\\">\\n    export async function load({ page: { params: { id } } }) {\\n        return { props: { id }};\\n    }\\n<\/script>\\n\\n<script>\\nimport Header from \\"../../components/Header.svelte\\";\\nimport Footer from \\"../../components/Footer.svelte\\";\\n\\n    export let id;\\n    console.log(id);\\n<\/script>\\n\\n<Header />\\n<section>\\n    <h1>{ id }</h1>\\n</section>\\n\\n<iframe src=\\"/ex-how-to-install-your-tracking-code/story.html\\" width=\\"100%\\" height=\\"700\\" title=\\"{id}\\"></iframe>\\n<Footer />\\n\\n<style>\\n    h1 {\\n        font-size: 50px;\\n        text-align: center;\\n        margin-bottom: 50px;\\n    }\\n</style>"],"names":[],"mappings":"AAuBI,EAAE,eAAC,CAAC,AACA,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,MAAM,CAClB,aAAa,CAAE,IAAI,AACvB,CAAC"}'
};
async function load({ page: { params: { id } } }) {
  return { props: { id } };
}
var U5Bidu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { id } = $$props;
  console.log(id);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  $$result.css.add(css);
  return `${validate_component(Header, "Header").$$render($$result, {}, {}, {})}
<section><h1 class="${"svelte-1gzncvq"}">${escape2(id)}</h1></section>

<iframe src="${"/ex-how-to-install-your-tracking-code/story.html"}" width="${"100%"}" height="${"700"}"${add_attribute("title", id, 0)}></iframe>
${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}`;
});
var _id_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bidu5D,
  load
});

// .svelte-kit/netlify/entry.js
init();
async function handler(event) {
  const { path, httpMethod, headers, rawQuery, body, isBase64Encoded } = event;
  const query = new URLSearchParams(rawQuery);
  const type = headers["content-type"];
  const rawBody = type && isContentTypeTextual(type) ? isBase64Encoded ? Buffer.from(body, "base64").toString() : body : new TextEncoder("base64").encode(body);
  const rendered = await render({
    method: httpMethod,
    headers,
    path,
    query,
    rawBody
  });
  if (rendered) {
    return {
      isBase64Encoded: false,
      statusCode: rendered.status,
      ...splitHeaders(rendered.headers),
      body: rendered.body
    };
  }
  return {
    statusCode: 404,
    body: "Not found"
  };
}
function splitHeaders(headers) {
  const h = {};
  const m = {};
  for (const key in headers) {
    const value = headers[key];
    const target = Array.isArray(value) ? m : h;
    target[key] = value;
  }
  return {
    headers: h,
    multiValueHeaders: m
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
