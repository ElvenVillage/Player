import React from 'react'
import ReactDOM from 'react-dom'
import { 
    createStore,
    StoreProvider
} from 'easy-peasy'

import App from './components/app'
import model from './model'
import './styles/index.css'

const store = createStore(model)

function Root() {
    return (
        <StoreProvider store={store}>
            <App />
        </StoreProvider>
    )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<Root />, rootElement)
