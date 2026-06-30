import * as fromAuth from './reducers/auth.reducer';
import * as fromSys from './reducers/system.reducer';

/**
 * combineReducers is another useful metareducer that takes a map of reducer
 * functions and creates a new reducer that stores the gathers the values
 * of each reducer and stores them using the reducer's key. Think of it
 * almost like a database, where every reducer is a table in the db.
 *
 * More: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
 */
import { ActionReducerMap } from '@ngrx/store';

import { AppState as State } from './interfaces';


export const reducers: ActionReducerMap<State> = {
    [fromAuth.AuthFeatureKey]: fromAuth.reducer,
    [fromSys.SystemFeatureKey]: fromSys.reducer,
};