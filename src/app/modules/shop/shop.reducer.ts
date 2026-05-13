import { Action, createReducer, on, State } from '@ngrx/store';
import { AppState } from '../../theme/interfaces';
import { ISite } from '../../theme/models/seo';
import { IAddress, ICart, ICartGroup } from './model';
import { logoutClear, setCart, setCheckoutCart, setSite } from './shop.actions';

export interface ShopState {
    site: ISite;
    cart: ICart|null;
    address: IAddress|null;
    goodsItems: ICartGroup[];
}
export const initialState: ShopState = {
    site: {} as any,
    cart: null,
    address: null,
    goodsItems: [],
};


const shopReducer = createReducer(
    initialState,
    on(setCart, (state, {cart}) => ({...state, cart})),
    on(setSite, (state, {site}) => ({...state, site})),
    on(setCheckoutCart, (state, {items}) => ({...state, goodsItems: items})),
    on(logoutClear, state => ({...initialState, site: state.site})),
);

export const shopFeatureKey = 'shop';
export interface ShopAppState extends AppState {
    [shopFeatureKey]: ShopState;
}

export function reducer(state: ShopState|undefined, action: Action<string>) {
    return shopReducer(state, action);
}

