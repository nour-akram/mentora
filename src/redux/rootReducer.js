import { combineReducers } from 'redux';
import registerReducer from './Register/registerReducer';
import articlesReducer from './Articles/articlesReducer';
import CommunityReducer from './Community/communityReducer';

const rootReducer = combineReducers({
  register: registerReducer,
  articles: articlesReducer,
  community:CommunityReducer
});

export default rootReducer;