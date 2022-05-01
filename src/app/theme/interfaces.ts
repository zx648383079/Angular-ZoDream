import * as fromAuth from './reducers/auth.reducer';
import * as fromSys from './reducers/system.reducer';

// This should hold the AppState interface
// Ideally importing all the substate for the application

/**
 *
 *
 */
export interface AppState {
    [fromAuth.AuthFeatureKey]: fromAuth.AuthState;
    [fromSys.SystemFeatureKey]: fromSys.SystemState;
}
