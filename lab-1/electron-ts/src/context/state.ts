import {IAuditDocument} from "../types";

export interface AppState {
    files: IAuditDocument[],
    files_loading: boolean,
    isParseView: boolean,
    parsedViewItem: any
    isEditView: boolean,
    editViewItem: any
}

export const InitialAppState: AppState = {
    files: [],
    files_loading: false,
    isParseView: false,
    parsedViewItem: null,
    isEditView: false,
    editViewItem: null
}