import axios from 'axios';

const fileAPI = axios.create({
    baseURL: 'http://localhost:8080/api/file/'
});

const regeditAPI = axios.create({
    baseURL: 'http://localhost:8080/api/regedit'
});

const authAPI = axios.create({
    baseURL: 'http://localhost:8080/api/auth'
});

const emailVerificationAPI = axios.create({
    baseURL: 'http://localhost:8080/api/email'
})

export const isEmailVerified = async (email: string) => {
    return emailVerificationAPI.get(`/is-email-verified/${email}`)
        .then(res => res.data)
        .catch(err => err.message)
}

export const sendUserEmailVerification = async (email: string) => {
    return emailVerificationAPI.post(`/send-email-verification/${email}`)
        .then(res => res.data)
        .catch(err => err.message)
}

export const getUserData = async () => {
    return authAPI.get('/login/success', {
        withCredentials: true,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true
        }
    })
        .then(res => res.data)
        .catch(err => err.message);
};

export const policyBatchFix = async (items) => {
    return await regeditAPI.post('/batch_enforce', {items})
        .then(res => res.data)
        .catch(err => err.message);
};

export const backupRegistry = async () => {
    return await regeditAPI.post('/backup')
        .then(res => res.data)
        .catch(err => err.message);
};

export const enforcePolicyItem = async (item) => {
    return await regeditAPI.post('/enforce', item)
        .then(res => res.data)
        .catch(err => err.message);
};

export const testCustomItem = async (item) => {
    // const body = {data: JSON.stringify(item)}
    return await regeditAPI.post('/', item)
        .then(res => res.data)
        .catch(err => err.message);
};

export const fetchAuditDocuments = async () => {
    return await fileAPI.get('/')
        .then(res => res.data)
        .catch(err => console.error(err.message));
};

export const checkUniqueDocument = async (filename) => {
    return await fileAPI.get('/exists/' + filename)
        .then(res => res.data)
        .catch(err => err.message);
};

export const uploadAuditDocument = async (formBody) => {
    return await fileAPI.post('/', formBody)
        .then(res => res.data)
        .catch(err => err.message);
};

export const downloadAuditFile = async (filename) => {
    return await fileAPI.get('/download/' + filename, {
        responseType: 'blob'
    }).then(res => res.data)
        .catch(err => err.message);
};

export const deleteAuditDocument = async (filename) => {
    return await fileAPI.delete('/' + filename)
        .then(res => res.data)
        .catch(err => err.message);
};

export const insertAuditDocument = async (body) => {
    return await fileAPI.post('/insert', body)
        .then(res => res.data)
        .catch(err => err);
};

export default fileAPI;
