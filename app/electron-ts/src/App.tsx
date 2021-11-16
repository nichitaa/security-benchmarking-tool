import {useContext, useEffect} from 'react';
import AuthenticatedView from './components/AuthenticatedView';
import {fetchUserAction} from './context/reducer';
import OAuthView from './components/OAuthView';
import {AppContext} from './context/context';
import './App.css';

const App = () => {

    const {state, dispatch} = useContext(AppContext);
    const {user} = state;

    useEffect(() => {
        dispatch(fetchUserAction());
    }, [dispatch]);

    return (
        <div className="App">
            {user === null
                ? <OAuthView/>
                : <AuthenticatedView/>}
        </div>
    );

};

export default App;
