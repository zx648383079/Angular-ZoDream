import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SystemFeatureKey, SystemState } from './system.reducer';


export const selectSystem = createFeatureSelector<SystemState>(SystemFeatureKey);

export const selectSystemConfig = createSelector(
    selectSystem,
    (state: SystemState) => state.configs
);