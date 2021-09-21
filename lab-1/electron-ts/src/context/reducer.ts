import {AppState} from "./state";
import {fetchAuditDocuments} from "../services/api";
import {ActionType} from "./actions";

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
        default:
            return state;
    }
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
        dispatch(fetchData())
    }
}

export const updateEditViewItem = (item) => (dispatch, getState) => {
    dispatch({type: ActionType.UpdateEditViewItem, payload: item})
}

export const updateParseViewItem = (item) => (dispatch, getState) => {
    dispatch({type: ActionType.UpdateParsedViewItem, payload: item})
}



