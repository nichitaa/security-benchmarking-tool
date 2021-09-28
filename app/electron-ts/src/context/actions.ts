export enum ActionType {
    FetchDocuments = 'FetchDocuments',
    FetchDocumentsLoading = 'FetchDocumentsLoading',
    ToggleIsParsedView = 'ToggleIsParsedView',
    UpdateParsedViewItem = 'UpdateParsedViewItem',
    ToggleIsEditView = 'ToggleIsEditView',
    UpdateEditViewItem = 'UpdateEditViewItem',
    UpdateSystemScanStats = 'UpdateSystemScanStats',
    ToggleInspectIsLoading = 'ToggleInspectIsLoading',
    ToggleShowInspectionResult = 'ToggleShowInspectionResult',
    UpdateEditViewCustomItems = 'UpdateEditViewCustomItems',
    ToggleBackupLoading = 'ToggleBackupLoading',
    ToggleBatchFixPolicyItemsLoading = 'ToggleBatchFixPolicyItemsLoading',
    UpdateFilteredCustomItems = 'UpdateFilteredCustomItems'
}

export type AppActions = ActionType