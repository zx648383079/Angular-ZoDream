import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ShopAppState, shopFeatureKey, ShopState } from './shop.reducer';

export const selectShop = createFeatureSelector<ShopAppState, ShopState>(shopFeatureKey);

export const selectShopCart = createSelector(
    selectShop,
    (state: ShopState) => state.cart
);

export const selectSite = createSelector(
    selectShop,
    (state: ShopState) => state.site
);

export const selectShopCheckout = createSelector(
    selectShop,
    (state: ShopState) => state.goodsItems
);
