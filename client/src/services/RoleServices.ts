import AxiosInstance from "../AxiosInstance";

const RoleServices = {
    loadRoles: async () => {
        return AxiosInstance.get('/api/loadRoles').then((response) => response).catch((error) => {
            throw error;
        });
    },
   storeRole: async (data: any) => {
    return AxiosInstance.post('/api/storeRole', data).then((response)=> response).catch((error)=>{
        throw error;
    });
   },
   updateRole: async (id: number, data: any) => {
    return AxiosInstance.put(`/api/updateRole/${id}`, data)
        .then((response) => response)
        .catch((error) => {
            throw error;
        });
   },
   deleteRole: async (id: number) => {
    return AxiosInstance.delete(`/api/deleteRole/${id}`)
        .then((response) => response)
        .catch((error) => {
            throw error;
        });
   },
}

export default RoleServices;