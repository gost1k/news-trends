import axios from "axios"
export const getTrendsList = (limit: number) => {
    return axios.get(`/api/v1/trends/list/${limit}`)
}