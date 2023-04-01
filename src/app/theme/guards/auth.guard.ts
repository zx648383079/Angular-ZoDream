import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services';

/**
 * 需要登录才能访问的页面控制
 * @param _ 
 * @param state 
 * @returns 
 */
export const CanActivateViaAuthGuard: CanActivateFn = (_, state) => {
    return inject(AuthService).canActivate(state.url);
};

/**
 * 需要有某种权限才能访问的页面控制
 * @param roles 
 * @returns 
 */
export function CanActivateAuthRole(...roles: string[]): CanActivateFn {
    return (_, state) => {
        return inject(AuthService).canActivate(state.url, ...roles);
    }
}