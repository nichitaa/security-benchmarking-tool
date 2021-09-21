import React from "react";
import {AppContext, useMiddlewareReducer} from "./context";
import {InitialAppState} from "./state";
import {appReducer} from "./reducer";

export const AppProvider = ({children}) => {
    const [state, dispatch] = useMiddlewareReducer(appReducer, InitialAppState)
    return (
        <AppContext.Provider value={{state, dispatch}}>
            {children}
        </AppContext.Provider>
    )
}