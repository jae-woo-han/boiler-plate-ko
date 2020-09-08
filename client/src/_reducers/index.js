import {combineReducers } from 'redux';//스토어에 reducer가 여러가지 있을 수 있다.
import user from './user_reducer';

const rootReducer = combineReducers({
    user
});

export default rootReducer;