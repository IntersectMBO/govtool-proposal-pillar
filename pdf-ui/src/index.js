import { BrowserRouter } from 'react-router';

import App from './App.jsx';

function Root({ locale, ...props }) {
    return (
        // Lift up the Router to the Root component to allow consuming the package by the Apps that already includes a Router
        <BrowserRouter>
           <App {...props} />
        </BrowserRouter>
    );
}

export default Root;
