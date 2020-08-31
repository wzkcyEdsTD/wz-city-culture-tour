import axios from "axios";
const commonParams = {};

/**
 * 公共的post方法
 * @export
 * @param {*} url
 * @param {*} data
 * @returns
 */
export function post(url, data) {
  return axios.request({ url: url, data: data, method: "post" }).then(res => {
    return Promise.resolve(res);
  });
}

/**
 * 公共的get方法
 * @export
 * @param {*} url
 * @param {*} data
 * @returns
 */
export function get(url, data) {
  const allData = Object.assign({}, commonParams, data);
  return axios
    .request({
      url: url,
      method: "get",
      params: allData
    })
    .then(res => {
      return Promise.resolve(res);
    });
}

/**
 * POST 方法封装  (参数处理)
 * @export
 * @param {*} url
 * @param {*} params
 * @returns
 */
export function postRequest(url, params) {
  return axios({
    method: "post",
    url: url,
    data: params,
    transformRequest: [
      function(data) {
        let ret = "";
        for (const it in data) {
          ret +=
            encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
        }
        return ret;
      }
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

/**
 * POST 方法封装  (文件上传)
 * @param {*} url
 * @param {*} params
 */
export const uploadFileRequest = (url, params) => {
  return axios({
    method: "post",
    url: url,
    data: params,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

/**
 * GET 方法封装
 * @param {*} url
 */
export const getRequest = url => {
  return axios({
    method: "get",
    url: url
  });
};

/**
 * PUT 方法封装
 * @param {*} url
 * @param {*} params
 */
export const putRequest = (url, params) => {
  return axios({
    method: "put",
    url: url,
    data: params
  });
};

/**
 * DELETE 方法封装
 * @param {*} url
 */
export const deleteRequest = url => {
  return axios({
    method: "delete",
    url: url
  });
};
