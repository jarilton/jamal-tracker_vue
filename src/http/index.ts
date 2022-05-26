import axios, { AxiosInstance } from "axios";

const clienteHttp: AxiosInstance = axios.create({
    baseURL: "http://localhost:3306/" 
})

export default clienteHttp