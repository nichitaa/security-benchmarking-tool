import {IAuditDocument} from "../types";

export interface AppState {
    files: IAuditDocument[],
    files_loading: boolean,
    isParseView: boolean,
    parsedViewItem: any
    isEditView: boolean,
    editViewItem: any,
    showInspectionResult: boolean,
    inspectIsLoading: boolean,
    passedNumber: number | null,
    warningNumber: number| null,
    failNumber: number| null
}

export const InitialAppState: AppState = {
    files: [],
    files_loading: false,
    isParseView: false,
    parsedViewItem: null,
    isEditView: false,
    editViewItem: null,
    inspectIsLoading: false,
    showInspectionResult: false,
    passedNumber: 0,
    warningNumber: 0,
    failNumber: 0
}