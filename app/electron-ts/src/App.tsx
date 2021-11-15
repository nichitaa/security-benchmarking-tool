import {useContext, useEffect, useState} from 'react';
import './App.css';
import {ParsedView} from './components/ParsedView';
import {DocumentList} from './components/DocumentList';
import CreateView from './components/CreateView';
import {AppContext} from './context/context';
import {fetchData} from './context/reducer';
import {Button} from 'antd';
import {getUserData} from './services/api';

const App = () => {

    const {state, dispatch} = useContext(AppContext);
    const [user, setUser] = useState<null | any>(null);
    const {isParseView, isEditView} = state;

    useEffect(() => {
        dispatch(fetchData());
        const getUser = async () => {
            const res = await getUserData();
            if (res.user) setUser(res.user);
            console.log('user data: ', res.user);
        };
        getUser();
    }, [dispatch]);

    const googleLogin = () => {
        window.open('http://localhost:8080/api/auth/google', '_self');
    };

    const githubLogin = () => {
        window.open('http://localhost:8080/api/auth/github', '_self');
    };

    const twitterLogin = () => {
        window.open('http://localhost:8080/api/auth/twitter', '_self');
    };

    const appLogout = () => {
        window.open('http://localhost:8080/api/auth/logout', '_self');
    };

    return (
        <div className="App">
            {user === null
            && <>
                <Button onClick={googleLogin}>Google Login</Button>
                <Button onClick={githubLogin}>Github Login</Button>
                <Button onClick={twitterLogin}>Twitter Login</Button>
            </>}
            {user !== null
            && <Button onClick={appLogout}>Logout</Button>}

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
