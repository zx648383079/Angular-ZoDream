import { Map, Record, List } from 'immutable';

interface IAuthState {
  isAuthenticated: boolean;
  currentUser: any;
  ratingCategories: List<Object>;
}

export interface AuthState extends Map<string, any>, IAuthState {
}

export const AuthStateRecord = Record({
  isAuthenticated: false,
  currentUser: Map({}),
  ratingCategories: List([])
});
