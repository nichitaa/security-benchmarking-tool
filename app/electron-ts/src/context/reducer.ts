import {AppState} from "./state";
import {
    backupRegistry,
    enforcePolicyItem,
    fetchAuditDocuments,
    policyBatchFix,
    testCustomItem
} from "../services/api";
import {ActionType} from "./actions";
import {IAuditCustomItem} from "../types";
import {showMessage} from "../utils";

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
        case ActionType.UpdateSytemScanStats:
            return {
                ...state,
                inspectIsLoading: false,
                failNumber: payload.fail,
                warningNumber: payload.warn,
                passedNumber: payload.pass,
                showInspectionResult: true
            }
        case ActionType.ToggleInspectIsLoading:
            return {...state, inspectIsLoading: payload}
        case ActionType.UpdateEditViewCustomItems:
            return {...state, editViewItem: {...state.editViewItem, audit_custom_items: payload}}
        case ActionType.ToggleBackupLoading:
            return {...state, backupLoading: payload}
        case ActionType.ToggleBatchFixPolicyItemsLoading:
            return {...state, batchFixLoading: payload}
        default:
            return state;
    }
}

export const updateEditViewItemPolicies = (policy: IAuditCustomItem, upd: IAuditCustomItem) => (dispatch, getState) => {
    const state = getState();
    const {editViewItem} = state;
    const {audit_custom_items} = editViewItem;
    let temp: IAuditCustomItem[] = [];
    temp = audit_custom_items.map(el => el.policy_reference === policy.policy_reference && el.policy_description === policy.policy_description ? {...el, ...upd} : el)
    dispatch({type: ActionType.UpdateEditViewCustomItems, payload: temp})
}


export const singlePolicyFixAction = (policy: IAuditCustomItem, cb?) => async (dispatch, getState) => {
    enforcePolicyItem(policy)
        .then(res => {
            console.log('single fix response: ', res)
            if (res.isSuccess) {
                dispatch(singlePolicyScanAction(policy, cb))
            } else {
                cb()
            }
        })
}

export const singlePolicyScanAction = (policy, cb) => async (dispatch, getState) => {
    testCustomItem(policy)
        .then(res => {
            console.log('single scan response: ', res)
            dispatch(updateEditViewItemPolicies(policy, {
                passed: res.isSuccess,
                warning: res.warning,
                reason: res.reason,
                isEnforced: !res.isSuccess || res.warning ? true : undefined
            }))
            setTimeout(() => {
                cb()
            }, 300)
        })
}

export const batchPolicyItemsFixAction = () => async (dispatch, getState) => {
    dispatch({type: ActionType.ToggleBatchFixPolicyItemsLoading, payload: true})
    const state = getState();
    const {editViewItem} = state;
    const {audit_custom_items} = editViewItem;
    let temp: IAuditCustomItem[] = [];
    // temp = audit_custom_items.filter(el => el.isEnforced)
    audit_custom_items.forEach(el => {
        if (el.isEnforced) {
            temp.push({...el})
        }
    })
    console.log('batch: ', temp)
    if (temp.length) {
        policyBatchFix(temp)
            .then(res => {
                console.log('[response] fix all policy items: ', res)
                dispatch({type: ActionType.ToggleBatchFixPolicyItemsLoading, payload: false})
                dispatch(inspectEditViewItem())
            })
            .catch(err => {
                console.log('batch fix error: ', err.message)
                dispatch({type: ActionType.ToggleBatchFixPolicyItemsLoading, payload: false})
            })
    } else {
        showMessage('error', 'No policy items to fix', 2)
        dispatch({type: ActionType.ToggleBatchFixPolicyItemsLoading, payload: false})
    }
}

export const backupMachineRegistry = () => async (dispatch, getState) => {
    dispatch({type: ActionType.ToggleBackupLoading, payload: true})
    backupRegistry()
        .then(res => {
            console.log('backup result: ', res)
            dispatch({type: ActionType.ToggleBackupLoading, payload: false})
            if (res.isSuccess) {
                showMessage('success', `Full system registry backup in directory ${res.dir}`, 5)
            } else {
                showMessage('error', res.error, 2)
            }
        })
}

export const enforceAllPolicies = (bool) => async (dispatch, getState) => {
    const state = getState();
    const {editViewItem} = state;
    const {audit_custom_items} = editViewItem;
    const temp: IAuditCustomItem[] = [];
    audit_custom_items.forEach(el => {
        if (el.passed === false || el.warning === true) {
            temp.push({...el, isEnforced: bool})
        } else {
            temp.push({...el})
        }
    })
    dispatch({type: ActionType.UpdateEditViewCustomItems, payload: temp})
}

export const inspectEditViewItem = () => async (dispatch, getState) => {
    dispatch({type: ActionType.ToggleInspectIsLoading, payload: true})
    const state = getState();
    const {editViewItem} = state;
    const {audit_custom_items} = editViewItem;
    let passedCounter = 0;
    let failedCounter = 0;
    let warningCounter = 0;
    for (let i = 0; i < audit_custom_items.length; i++) {
        const item = audit_custom_items[i];
        const res = await testCustomItem(item)
        const updateObj: IAuditCustomItem = {
            passed: res.isSuccess,
            warning: res.warning,
            isEnforced: false,
            reason: res.reason
        }
        if (res.isSuccess && !res.warning) passedCounter++
        if (res.warning) warningCounter++
        if (!res.isSuccess) failedCounter++

        // show live time results
        dispatch(updateEditViewItemPolicies(item, updateObj))
    }
    dispatch({type: ActionType.ToggleInspectIsLoading, payload: false});
    dispatch({
        type: ActionType.UpdateSytemScanStats,
        payload: {fail: failedCounter, warn: warningCounter, pass: passedCounter}
    });
}

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



