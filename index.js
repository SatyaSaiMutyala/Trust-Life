/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { applyMiddleware, legacy_createStore as createStore } from 'redux';
import allReducers from './src/reducers/index.js';
import { Provider } from 'react-redux';
import { thunk } from 'redux-thunk';
import logger from 'redux-logger';

const middleware = [thunk];
if(process.env.NODE_ENV === 'development') {
    middleware.push(logger)
}
const store = createStore(allReducers, applyMiddleware(...middleware));

const ReduxApp = () => (
	<Provider store={store}>

			<App />

	</Provider>
)

AppRegistry.registerComponent(appName, () => ReduxApp);
LogBox.ignoreAllLogs();
