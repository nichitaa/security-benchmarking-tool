import {useEffect, useState} from 'react';
import './App.css';
import {
    checkUniqueDocument,
    deleteAuditDocument,
    downloadAuditFile,
    fetchAuditDocuments,
    uploadAuditDocument
} from './services/api';
import fileDownload from 'js-file-download';
import {ParsedView} from "./components/ParsedView";
import {DocumentList} from "./components/DocumentList";
import CreateView from "./components/CreateView";
import {showMessage} from "./utils";

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
    const [isParseView, setIsParseView] = useState<boolean>(false);
    const [isEditView, setIsEditView] = useState<boolean>(false);
    const [editViewItem, setEditViewItem] = useState<AuditDocument>({});
    const [parsedViewItem, setParsedViewItem] = useState<AuditDocument>({});

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        setLoading(true);
        fetchAuditDocuments()
            .then(res => {
                console.log("[fetchAuditDocuments] response: ", res);
                setFiles(res.files);
                setLoading(false);
            })
            .catch(err => {
                console.error(err.message);
                setLoading(false);
            });
    };

    const handleFileUpload = async ({file, onSuccess, onError}) => {
        const filename = file.name;
        console.log('[filename] ', filename)
        const auditRegex = /.audit$/g
        const exec = auditRegex.exec(filename);
        if (exec !== null) {
            const fileExists = await checkUniqueDocument(filename);
            console.log('[checkUniqueDocument] response: ', fileExists);
            if (fileExists.exists) {
                showMessage('error', `the file ${filename} already exists`, 2)
                onError('error');
            } else {
                const form = new FormData();
                form.append('file', file, filename);
                form.append('fileName', filename);
                uploadAuditDocument(form)
                    .then(res => {
                        console.log('[uploadAuditDocument] response: ', res);
                        if (res.isSuccess) {
                            showMessage('success', 'uploaded successfully ✔', 1)
                            fetchDocuments();
                            onSuccess('success');
                        } else {
                            showMessage('error', 'server error on file upload', 1);
                            onError('error');
                        }
                    })
                    .catch(err => {
                        console.error(err.message);
                        showMessage('error', 'Error on upload', 1);
                    });
            }
        } else {
            showMessage('error', 'file is not of type .audit', 1);
        }
    };

    const handleFileDownload = async (filename) => {
        downloadAuditFile(filename)
            .then(file => {
                console.log('[downloadAuditFile] response: ', file)
                fileDownload(file, filename, '.audit');
            })
            .catch(err => {
                console.error(err.message);
                showMessage('error', 'could not download audit file', 1);
            })
    };

    const deleteFile = async (filename) => {
        deleteAuditDocument(filename)
            .then(res => {
                console.log('[deleteAuditDocument] response: ', res);
                if (res.isSuccess) {
                    showMessage('success', 'deleted successfully ✔', 1);
                    fetchDocuments();
                } else {
                    showMessage('error', `could not delete file: ${filename}`, 1);
                }
            })
            .catch(err => {
                console.error(err.message);
                showMessage('error', `could not delete file: ${filename}`, 1);
            });
    };

    const updateParsedViewItem = (item) => {
        setParsedViewItem(item)
        setIsParseView(true)
    }

    const clearItem = () => {
        setIsParseView(false);
        setParsedViewItem({})
    }

    const toggleIsEditView = (bool) => {
        setIsEditView(bool);
        if (!bool) {
            setEditViewItem({});
            fetchDocuments();
        }
    }

    const updateEditViewItem = (newItem) => {
        setEditViewItem(item => newItem);
    }

    return (
        <div className="App">

            {/* MAIN VIEW */}
            <div style={{display: (isParseView || isEditView) ? 'none' : 'block'}}>
                <DocumentList
                    files={files}
                    handleFileUpload={handleFileUpload}
                    loading={loading}
                    handleFileDownload={handleFileDownload}
                    deleteFile={deleteFile}
                    updateParsedViewItem={updateParsedViewItem}
                    toggleIsEditView={toggleIsEditView}
                    updateEditViewItem={updateEditViewItem}
                />
            </div>

            {/* FILE PARSED VIEW */}
            <div style={{display: (isParseView) ? 'block' : 'none'}}>
                {isParseView && <ParsedView onBackClick={clearItem} newWindowItem={parsedViewItem}/>}
            </div>

            <div style={{display: (isEditView && Object.keys(editViewItem).length !== 0) ? 'block' : 'none'}}>
                {isEditView && <CreateView editViewItem={editViewItem} toggleIsEditView={toggleIsEditView}/>}
            </div>
        </div>
    );
};

export default App;
