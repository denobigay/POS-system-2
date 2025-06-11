import AxiosInstance from "../AxiosInstance";

const UserServices = {
    loadUsers: async () => {
        return AxiosInstance.get('/api/loadUsers')
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    },
    storeUser: async (data: FormData) => {
        return AxiosInstance.post('/api/storeUser', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    },
    updateUser: async (id: number, data: FormData) => {
        data.append('_method', 'PUT');
        return AxiosInstance.post(`/api/updateUser/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    },
    deleteUser: async (id: number) => {
        const formData = new FormData();
        formData.append('_method', 'DELETE');
        return AxiosInstance.post(`/api/deleteUser/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    },
}

export default UserServices; 