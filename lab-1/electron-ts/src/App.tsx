import {useContext, useEffect} from 'react';
import './App.css';
import {ParsedView} from "./components/ParsedView";
import {DocumentList} from "./components/DocumentList";
import CreateView from "./components/CreateView";
import {AppContext} from "./context/context";
import {fetchData} from "./context/reducer";

const App = () => {

    const {state, dispatch} = useContext(AppContext)
    const {isParseView, isEditView} = state;

    useEffect(() => {
        dispatch(fetchData())
    }, [dispatch]);

    return (
        <div className="App">
            {/* MAIN VIEW */}
            {(!isParseView && !isEditView) && <DocumentList/>}
            {/* FILE PARSED VIEW MODE */}
            {isParseView && <ParsedView/>}
            {/* FILE EDIT MODE */}
            {isEditView && <CreateView/>}
        </div>
    );

};

export default App;
