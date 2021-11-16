import React, {useContext, useEffect} from 'react';
import {DocumentList} from './DocumentList';
import {ParsedView} from './ParsedView';
import CreateView from './CreateView';
import {fetchData} from '../context/reducer';
import {AppContext} from '../context/context';
import OAuthUserDetails from './OAuthUserDetails';

const AuthenticatedView = () => {

    const {state, dispatch} = useContext(AppContext);
    const {isParseView, isEditView} = state;

    useEffect(() => {
        dispatch(fetchData());
    }, [dispatch]);


    return (
        <>
            {/* MAIN VIEW */}
            {(!isParseView && !isEditView) && <DocumentList/>}
            {/* FILE PARSED VIEW MODE */}
            {isParseView && <ParsedView/>}
            {/* FILE EDIT MODE */}
            {isEditView && <CreateView/>}
            <OAuthUserDetails/>
        </>
    );
};

export default AuthenticatedView;