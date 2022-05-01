import { Action, createReducer, on } from '@ngrx/store';
import { Record } from 'immutable';
import { setSystemConfig } from '../actions/system.actions';

interface ISystemState {
    configs: any;
}

export interface SystemState extends Map<string, any>, ISystemState {
}

export const SystemStateRecord = Record({
    configs: {},
});

export const initialState: any = new SystemStateRecord();

export const SystemFeatureKey = 'system';


const systemReducer = createReducer(
    initialState,
    on(setSystemConfig, (state, {configs}) => ({...state, configs})),
);

export function reducer(state: any, action: Action) {
    return systemReducer(state, action);
}
