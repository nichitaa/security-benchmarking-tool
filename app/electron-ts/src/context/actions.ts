export enum ActionType {
    FetchDocuments = 'FetchDocuments',
    FetchDocumentsLoading = 'FetchDocumentsLoading',
    ToggleIsParsedView = 'ToggleIsParsedView',
    UpdateParsedViewItem = 'UpdateParsedViewItem',
    ToggleIsEditView = 'ToggleIsEditView',
    UpdateEditViewItem = 'UpdateEditViewItem',
    InspectEditViewItem = 'InspectEditViewItem',
    ToggleInspectIsLoading = 'ToggleInspectIsLoading',
    ToggleShowInspectionResult = 'ToggleShowInspectionResult'
}

export type AppActions = ActionType