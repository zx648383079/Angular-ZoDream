import { createAction, props } from '@ngrx/store';


export const setSystemConfig = createAction('[sys]SET_CONFIG', props<{configs: any}>());