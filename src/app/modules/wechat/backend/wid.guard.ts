import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { WechatService } from './wechat.service';


@Injectable()
export class CanActivateMainId implements CanActivate {
    
    constructor(
        private service: WechatService,
        private router: Router,
    ) {
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if (this.service.baseId > 0) {
            return true;
        }
        this.router.navigate(['/backend/wx/account'], { queryParams: { redirect_uri: state.url }});
        return false;
    }
}