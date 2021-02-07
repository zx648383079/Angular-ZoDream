import { createAction, props } from '@ngrx/store';
import { ISite } from '../theme/models/seo';
import { ICart, ICartGroup } from '../theme/models/shop';

export const setCart = createAction('[shop]SET_CART', props<{cart: ICart}>());
export const setSite = createAction('[shop]SET_SITE', props<{site: ISite}>());
export const setCheckoutCart = createAction('[shop]SET_CHECKOUT_CART', props<{items: ICartGroup[]}>());

export const logoutClear = createAction('[shop]USER_LOGOUT');

