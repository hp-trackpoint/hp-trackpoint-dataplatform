import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import logger from './logger';

// 定义通用响应格式
interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
}

class Http {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL:
        process.env.NODE_ENV === 'development'
          ? '/api' // 处理跨域
          : 'http://62.234.16.19/', // 生产环境
      timeout: 5000,
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // TODO 项目暂时不做鉴权，后期考虑添加
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 添加请求日志
        logger.log('request', {
          url: config.url,
          method: config.method,
          params: config.params,
          data: config.data,
        });
        // 拦截器是一个链式调用的过程，要返回 config
        return config;
      },
      (err: any) => {
        logger.log('error', err);
        return Promise.reject(err);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (res: AxiosResponse<ResponseData>) => {
        // 后面会重构一下接口数据结构，自己封装一层状态码和错误信息，如果报错，可以弹出一个toast组建展示message
        // axios 本身会对 responese 做一层封装，可以看看 AxiosResponse 的类型定义，所以我们要先解构
        // 解构出的 data 就是我们后端返回的数据 -> ResponseData
        // 添加响应日志
        logger.log('response', {
          url: res.config.url,
          status: res.status,
          data: res.data,
        });

        const { data } = res;
        if (data.code !== 200) {
          // TODO 弹出一个toast组件展示错误信息
          return Promise.reject(data.message);
        }
        // 如果请求成功，返回数据，不返回 code 和 message
        return data.data;
      },
      (err: any) => {
        logger.log('error', err);
        return Promise.reject(err);
      }
    );
  }

  // 封装 GET 请求
  public get<T = any>(url: string, params?: any) {
    return this.instance.get<ResponseData<T>>(url, { params });
  }

  // 封装 POST 请求
  public post<T = any>(url: string, data?: any) {
    return this.instance.post<ResponseData<T>>(url, data);
  }

  // 封装 PATCH 请求
  public patch<T = any>(url: string, data?: any) {
    return this.instance.patch<ResponseData<T>>(url, data);
  }

  // 封装 DELETE 请求
  public delete<T = any>(url: string) {
    return this.instance.delete<ResponseData<T>>(url);
  }
}

export default new Http();
