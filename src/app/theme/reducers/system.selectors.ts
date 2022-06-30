import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ISystemOption } from '../models/seo';
import { SystemFeatureKey, SystemState } from './system.reducer';


export const selectSystem = createFeatureSelector<SystemState>(SystemFeatureKey);

export const selectSystemConfig = createSelector<object, SystemState, ISystemOption>(
    selectSystem,
    (state: SystemState) => state.configs
);