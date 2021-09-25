import {AppState} from "./state";
import {fetchAuditDocuments, testCustomItem} from "../services/api";
import {ActionType} from "./actions";
import {IAuditCustomItem} from "../types";

export const appReducer = (state: AppState, {type, payload}): AppState => {
    switch (type) {
        case ActionType.FetchDocuments:
            return {...state, files_loading: false, files: [...payload]}
        case ActionType.FetchDocumentsLoading:
            return {...state, files_loading: payload}
        case ActionType.ToggleIsParsedView:
            return {...state, isParseView: payload}
        case ActionType.ToggleIsEditView:
            return {...state, isEditView: payload}
        case ActionType.UpdateEditViewItem:
            return {...state, editViewItem: payload}
        case ActionType.UpdateParsedViewItem:
            return {...state, parsedViewItem: payload}
        case ActionType.ToggleShowInspectionResult:
            return {...state, showInspectionResult: payload}
        case ActionType.InspectEditViewItem:
            return {
                ...state,
                inspectIsLoading: false,
                failNumber: payload.fail,
                warningNumber: payload.warn,
                passedNumber: payload.pass,
                showInspectionResult: true,
                editViewItem: {...state.editViewItem, audit_custom_items: payload.audit_custom_items}
            }
        case ActionType.ToggleInspectIsLoading:
            return {...state, inspectIsLoading: payload}
        default:
            return state;
    }
}

export const inspectEditViewItem = () => async (dispatch, getState) => {
    dispatch({type: ActionType.ToggleInspectIsLoading, payload: true})
    const state = getState();
    const {editViewItem} = state;
    const {audit_custom_items} = editViewItem;
    const temp: IAuditCustomItem[] = [];
    let passedCounter = 0;
    let failedCounter = 0;
    let warningCounter = 0;
    for (let i = 0; i < audit_custom_items.length; i++) {
        const item = audit_custom_items[i];
        const res = await testCustomItem(item)
        if (res.isSuccess) {
            item['passed'] = true;
            if (res.warning === undefined) passedCounter++
        }
        if (res.warning) {
            item['warning'] = true;
            item['reason'] = res.reason;
            warningCounter++
        }
        if (!res.isSuccess) {
            item['passed'] = false;
            item['reason'] = res.reason
            failedCounter++
        }
        console.log('res: ', res)
        temp.push(item)
    }
    dispatch({
        type: ActionType.InspectEditViewItem,
        payload: {audit_custom_items: temp, fail: failedCounter, pass: passedCounter, warn: warningCounter}
    })
}

// helper functions to handle with state
export const fetchData = () => (dispatch, getState) => {
    dispatch({type: ActionType.FetchDocumentsLoading, payload: true})
    fetchAuditDocuments()
        .then(res => {
            dispatch({type: ActionType.FetchDocuments, payload: res.files})
        })
        .catch(err => {
            console.error(err.message);
        });
};

export const toggleIsParsedView = (bool) => (dispatch, getState) => {
    dispatch({type: ActionType.ToggleIsParsedView, payload: bool})
}

export const toggleIsEditView = (bool) => (dispatch, getState) => {
    dispatch({type: ActionType.ToggleIsEditView, payload: bool})
    if (!bool) {
        dispatch({type: ActionType.UpdateEditViewItem, payload: null})
        dispatch({type: ActionType.ToggleShowInspectionResult, payload: false})
        dispatch(fetchData())
    }
}

export const updateEditViewItem = (item) => (dispatch, getState) => {
    dispatch({type: ActionType.UpdateEditViewItem, payload: item})
}

export const updateParseViewItem = (item) => (dispatch, getState) => {
    dispatch({type: ActionType.UpdateParsedViewItem, payload: item})
}



