import React from 'react';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {AppState, InitialAppState} from './state';


const logger = createLogger({collapsed: true});

const middlewares = [thunk, logger];

export const useMiddlewareReducer = createUseMiddlewareReducer(middlewares);


// A middleware has type (dispatch, getState) => nextMw => action => action
function enhanceDispatch({getState, stateDispatch}) {
    return (...middlewares) => {
        let dispatch;
        const middlewareAPI = {
            getState,
            dispatch: action => dispatch(action)
        };
        dispatch = middlewares
            .map(m => m(middlewareAPI))
            .reduceRight((next, mw) => mw(next), stateDispatch);
        return dispatch;
    };
}

function createUseMiddlewareReducer(middlewares) {
    return (reducer, initState, initializer = s => s) => {
        const [state, setState] = React.useState(initializer(initState));
        const stateRef = React.useRef(state); // stores most recent state
        const dispatch = React.useMemo(
            () =>
                enhanceDispatch({
                    getState: () => stateRef.current, // access most recent state
                    stateDispatch: action => {
                        stateRef.current = reducer(stateRef.current, action); // makes getState() possible
                        setState(stateRef.current); // trigger re-render
                        return action;
                    }
                })(...middlewares),
            [reducer]
        );
        return [state, dispatch];
    };
}


export const AppContext = React.createContext<{ state: AppState, dispatch }>({
    state: InitialAppState,
    dispatch: () => undefined
});