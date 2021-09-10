import {useEffect, useState} from 'react';
import './App.css';
import api from './services/api';
import {
    message,
    notification
} from 'antd';
import fileDownload from 'js-file-download';
import {ParsedView} from "./components/ParsedView";
import {DocumentList} from "./components/DocumentList";

// TODO: define types
export type AuditDocument = {
    audit_file?: {
        filename?: string
    },
    audit_display_name?: string
};

const App = () => {

    const [files, setFiles] = useState<AuditDocument[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isParseView, setIsParseView] = useState(false);
    const [parsedViewItem, setParsedViewItem] = useState<AuditDocument>({});

    useEffect(() => {
        fetchFiles();
    }, []);

    useEffect(() => {
        console.log("parsedItem: ", parsedViewItem);
    }, [parsedViewItem])

    const fetchFiles = async () => {
        setLoading(true);
        const res = await api.get('/');
        const data = res.data;
        console.log('files: ', data);
        setFiles(files => data.files);
        setLoading(false);
    };

    const openNotification = (type, msg, description) => {
        notification[type]({
            message: msg,
            description: description
        });
    };

    const handleFileUpload = async ({file, onSuccess, onError}) => {
        console.log("file: ", file)
        const filename = file.name;
        const auditRegex = /.audit$/g
        const exec = auditRegex.exec(filename);
        if (exec !== null) {
            const resExists = await api.get('/exists/' + filename);
            const exists = resExists.data.exists;
            console.log('exists: ', exists);
            if (exists) {
                openNotification('error', 'Error on file upload ❌', 'The file with the same name already exists!');
                onError('error');
            } else {
                const form = new FormData();
                form.append('file', file, filename);
                form.append('fileName', filename);
                const res = await api.post('/', form)
                    .then(res => res.data)
                    .catch(err => err);
                console.log('uploaded file: ', res);
                if (res.isSuccess) {
                    message.success('uploaded successfully ✔', 1);
                    fetchFiles().then(res => {
                        onSuccess('ok')
                    });
                } else {
                    openNotification('error', 'Error on upload ❌', 'Server error on file upload');
                    onError('error');
                }
            }
        } else {
            message.error('file is not of type .audit ❌', 1);
        }
    };

    const handleFileDownload = async (filename) => {
        console.log('filename: ', filename);
        api.get('/download/' + filename, {
            responseType: 'blob'
        })
            .then((res) => {
                fileDownload(res.data, filename);
            });
    };

    const deleteFile = async (filename) => {
        const res = await api.delete('/' + filename);
        console.log('delete res: ', res);
        const isSuccess = res.data.isSuccess;
        if (isSuccess) {
            message.success('deleted successfully ✔', 1);
            fetchFiles();
        } else {
            openNotification('error', 'Error', 'The file: ' + filename + ' was not deleted :(');
        }
    };


    const updateParsedViewItem = (item) => {
        setParsedViewItem(item)
        setIsParseView(true)
    }

    const clearItem = () => {
        setIsParseView(false);
        setParsedViewItem({})
    }

    return (
        <div className="App">

            {/* MAIN VIEW */}
            <div style={{display: isParseView ? 'none' : 'block'}}>
                <DocumentList
                    files={files}
                    handleFileUpload={handleFileUpload}
                    loading={loading}
                    handleFileDownload={handleFileDownload}
                    deleteFile={deleteFile}
                    updateParsedViewItem={updateParsedViewItem}
                />
            </div>

            {/* FILE PARSED VIEW */}
            <div style={{display: isParseView ? 'block' : 'none'}}>
                <ParsedView onBackClick={clearItem} newWindowItem={parsedViewItem}/>
            </div>

        </div>
    );
};

export default App;
