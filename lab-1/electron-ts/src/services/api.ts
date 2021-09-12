import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/file/'
});

export const fetchAuditDocuments = async () => {
    return await api.get('/')
        .then(res => res.data)
        .catch(err => console.error(err.message));
}

export const checkUniqueDocument = async (filename) => {
    return await api.get('/exists/' + filename)
        .then(res => res.data)
        .catch(err => err.message)
}

export const uploadAuditDocument = async (formBody) => {
    return await api.post('/', formBody)
        .then(res => res.data)
        .catch(err => err.message);
}

export const downloadAuditFile = async (filename) => {
    return await api.get('/download/' + filename, {
        responseType: 'blob'
    }).then(res => res.data)
        .catch(err => err.message);
}

export const deleteAuditDocument = async (filename) => {
    return await api.delete('/' + filename)
        .then(res => res.data)
        .catch(err => err.message);
}

export const insertAuditDocument = async (body) => {
    return await api.post('/insert', body)
        .then(res => res.data)
        .catch(err => err);
}

export default api;
