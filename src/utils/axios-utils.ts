import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const axios = Axios.create({})

export const error401 = (error: AxiosError) => {
    if (error.response?.status === 401) {
        // AuthService.logout();
    }
    return Promise.reject(error);
}


type RequestReturnType<R, UseResponseData extends boolean> = UseResponseData extends true ? R : AxiosResponse<R>;

export async function request<R, UseResponseData extends boolean = true>(
    config: AxiosRequestConfig,
    useResponseData: UseResponseData = true as UseResponseData
): Promise<RequestReturnType<R, UseResponseData>> {
    if (!axios.defaults.baseURL) {
        throw new Error('Error: Base Url is not provided');
    }
    const resp = await axios.request<R>(config);
    if (useResponseData) {

        return resp.data as RequestReturnType<R, UseResponseData>;
    } else {
        return resp as RequestReturnType<R, UseResponseData>;
    }
}


export const throwError = (error: AxiosError) => { console.log({ error }); throw error; }

const axiosUtils = {


    setBaseAPI_URL: (url?: string) => axios.defaults.baseURL = url,

    setHeader: (type = 'Content-Type', value = 'application/json') => {
        axios.defaults.headers.common[type] = value
    },

    setAuthHeader: (access_token: string) => axios.defaults.headers.common['Authorization'] = access_token,

    throwError: (error: AxiosError) => { console.log('Error', error.response); throw error }

}

export default axiosUtils