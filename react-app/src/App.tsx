import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import SignIn from "./Screens/Signin";
import Major from './Content/Components/Major';
import MyAccount from './Content/Components/UserTable/MyAccount';
import CommonSite from './Content/MainSite/CommonSite';
import FileManager from "./Content/Components/FolderSystem/FileManager";
import PrivateRoute from './Screens/PrivateRoute';
import AccessDenied from './Content/Components/AccessDenied';
import Home from './Content/Components/HomePage/Home';
import LoadingScreen from './Content/Components/LoadingScreen/LoadingScreen';

export interface FolderData {
    id: number;
    name: string;
    subfolders: FolderData[];
}

const RouteChangeHandler: React.FC<{ setLoading: (loading: boolean) => void }> = ({ setLoading }) => {
    const location = useLocation();

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [location, setLoading]);

    return null;
};

function App() {
    const [loading, setLoading] = useState(false);

    return (
        <div className="App">
            <BrowserRouter>
                <RouteChangeHandler setLoading={setLoading} />
                {/*{loading && <LoadingScreen />}*/}
                <Routes>
                    <Route path="/" element={<CommonSite />} />
                    <Route path="/Login" element={<SignIn />} />
                    <Route path="/access-denied" element={<AccessDenied />} />
                    <Route path='/LoadingScreen' element={<LoadingScreen />} />
                    <Route
                        path="/Home"
                        element={
                            <PrivateRoute roles={['ADMINISTRATOR', 'ACCOUNTER', 'USER']}>
                                <Home />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/AccountTable"
                        element={
                            <PrivateRoute roles={['ADMINISTRATOR', 'ACCOUNTER']}>
                                <Major />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/MyAccount"
                        element={
                            <PrivateRoute roles={['ADMINISTRATOR']}>
                                <MyAccount />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/Folders"
                        element={
                            <PrivateRoute roles={['ADMINISTRATOR', 'USER']}>
                                <FileManager />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;




// import './App.css';
//
//
// import {BrowserRouter, Routes, Route} from "react-router-dom";
// import SignIn from "./Screens/Signin";
// import Major from './Content/Components/Major';
// import MyAccount from './Content/Components/MyAccount';
// import CommonSite from './Content/MainSite/CommonSite';
//
// import FolderScreen from './Content/Components/FolderSystem/FolderScreen';
// import PrivateRoute from './Screens/PrivateRoute';
// import AccessDenied from './Content/Components/AccessDenied';
// import Home from './Content/Components/HomePage/Home';
// import LoadingScreen from './Content/Components/LoadingScreen/LoadingScreen';
//
// export interface FolderData {
//     id: number;
//     name: string;
//     subfolders: FolderData[];
// }
//
// function App() {
//    
//     return (
//         <div className="App">
//             <BrowserRouter>
//                 <Routes>
//                     <Route path="/mainPage" element={<CommonSite/>}/>
//                     <Route path="/Login" element={<SignIn/>}/>
//                     <Route path="/access-denied" element={<AccessDenied/>}/>
//                     <Route path='/LoadingScreen' element={<LoadingScreen/>}/>
//                     <Route
//                         path="/Home"
//                         element={
//                             <PrivateRoute roles={['ADMINISTRATOR', 'ACCOUNTER', 'USER']}>
//                                 <Home/>
//                             </PrivateRoute>
//                         }
//                     />
//                     <Route
//                         path="/AccountTable"
//                         element={
//                             <PrivateRoute roles={['ADMINISTRATOR', 'ACCOUNTER']}>
//                                 <Major/>
//                             </PrivateRoute>
//                         }
//                     />
//                     <Route
//                         path="/MyAccount"
//                         element={
//                             <PrivateRoute roles={['ADMINISTRATOR']}>
//                                 <MyAccount/>
//                             </PrivateRoute>
//                         }
//                     />
//                     <Route
//                         path="/Folders"
//                         element={
//                             <PrivateRoute roles={['ADMINISTRATOR', 'USER']}>
//                                 <FolderScreen/>
//                             </PrivateRoute>
//                         }
//                     />
//                 </Routes>
//             </BrowserRouter>
//         </div>
//     );
// }
//
// export default App;


