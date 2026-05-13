import { Action, createReducer, on } from '@ngrx/store';
import { setSystemConfig } from '../actions/system.actions';

export interface SystemState {
    configs: any;
}

export const initialState: any = {
    configs: {},
};

export const SystemFeatureKey = 'system';


const systemReducer = createReducer(
    initialState,
    on(setSystemConfig, (state, {configs}) => ({...state, configs})),
);

export function reducer(state: any, action: Action) {
    return systemReducer(state, action);
}
