export enum ActionType {
    FetchDocuments = 'FetchDocuments',
    FetchDocumentsLoading = 'FetchDocumentsLoading',
    ToggleIsParsedView = 'ToggleIsParsedView',
    UpdateParsedViewItem = 'UpdateParsedViewItem',
    ToggleIsEditView = 'ToggleIsEditView',
    UpdateEditViewItem = 'UpdateEditViewItem',
    UpdateSytemScanStats = 'UpdateSytemScanStats',
    ToggleInspectIsLoading = 'ToggleInspectIsLoading',
    ToggleShowInspectionResult = 'ToggleShowInspectionResult',
    UpdateEditViewCustomItems = 'UpdateEditViewCustomItems',
    ToggleBackupLoading = 'ToggleBackupLoading',
    ToggleBatchFixPolicyItemsLoading = 'ToggleBatchFixPolicyItemsLoading'
}

export type AppActions = ActionType