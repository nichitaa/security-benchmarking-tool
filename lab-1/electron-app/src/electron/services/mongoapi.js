import fetch from 'electron-fetch';

const mongoUploadAuditFile = async (_, body) => {
    return await fetch('http://localhost:8080/api/fileUpload', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(json => {
            console.log('RESPONSE: ', json);
            return json;
        });
};

export default mongoUploadAuditFile;
