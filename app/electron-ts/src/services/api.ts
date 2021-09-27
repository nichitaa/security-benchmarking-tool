import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/file/'
});

const regeditApi = axios.create({
    baseURL: 'http://localhost:8080/api/regedit'
});

export const policyBatchFix = async (items) => {
    return await regeditApi.post('/batch_enforce', {items})
        .then(res => res.data)
        .catch(err => err.message)
}

export const backupRegistry = async () => {
    return await regeditApi.post('/backup')
        .then(res => res.data)
        .catch(err => err.message)
}

export const enforcePolicyItem = async (item) => {
    return await regeditApi.post('/enforce', item)
        .then(res => res.data)
        .catch(err => err.message)
}

export const testCustomItem = async (item) => {
    // const body = {data: JSON.stringify(item)}
    return await regeditApi.post('/', item)
        .then(res => res.data)
        .catch(err => err.message)
}

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
