'use client';

import './index.scss';
import { GlobalWrapper, ThemeProviderWrapper } from './components';
import { AppContextProvider } from './context/context';

function App({ ...props }) {
    return (
        <div
            className='App'
            style={{
                width: '100%',
                height: '100%',
            }}
        >
            <AppContextProvider>
                <ThemeProviderWrapper>
                    <GlobalWrapper {...props} />
                </ThemeProviderWrapper>
            </AppContextProvider>
        </div>
    );
}

export default App;
