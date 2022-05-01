import { Action, createReducer, on, State } from '@ngrx/store';
import { Map, Record } from 'immutable';
import { AppState } from '../theme/interfaces';
import { ISite } from '../theme/models/seo';
import { IAddress, ICart, ICartGroup } from '../theme/models/shop';
import { logoutClear, setCart, setCheckoutCart, setSite } from './shop.actions';

interface IShopState {
    site: ISite;
    cart: ICart;
    address: IAddress;
    goodsItems: ICartGroup[];
}

export interface ShopState extends Map<string, any>, IShopState {
}

export const ShopStateRecord = Record({
    site: {},
    cart: null,
    address: null,
    goodsItems: [],
});


export const initialState: any = new ShopStateRecord();


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

export function reducer(state: State<ShopAppState> | undefined, action: Action) {
    return shopReducer(state, action);
}

