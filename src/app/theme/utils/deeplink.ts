import { Router } from '@angular/router';
import { intValidate } from '../validators';

export const DEEPLINK_SCHEMA = 'zodream';

export const openLink = (router: Router, link: string): boolean => {
    if (!link || link.length < 1 || link.charAt(0) === '#' || link.indexOf('javascript:') === 0) {
        return;
    }
    // {Scheme}://{string|b}/{module}/{param}?{Key}={Value}
    // zodream://b/user/1   =>  http://localhost/backend/user/1
    // zodream://chat   =>  http://localhost/chat
    let items = link.split('://', 2);
    const schema = items[0];
    if (schema === 'http' || schema === 'https') {
        window.open(link, '_blank');
        return;
    }
    if (schema !== DEEPLINK_SCHEMA) {
        return false;
    }
    if (items.length < 2) {
        router.navigate(['/']);
        return;
    }
    items = items[1].split('?', 2);
    const params = items[0].split('/');
    const host = params.shift();
    if (host === 'chat') {
        router.navigate(['/chat']);
        return;
    }
    const path = params.shift();
    if (host === 'micro' && intValidate(path)) {
        router.navigate(['/micro', path]);
        return;
    }
    const queries: any = {};
    if (items.length > 1 && items[1].length > 0) {
        items[1].split('&').forEach(line => {
            const parts = line.split('=', 2);
            queries[parts[0]] = decodeURIComponent(parts[1])
        });
    }
    if (host === 'blog') {
        if (intValidate(path)) {
            router.navigate(['/frontend/blog', path]);
            return;
        }
        if (path === 'search') {
            router.navigate(['/frontend/blog'], {queryParams: queries});
            return;
        }
        return;
    }
    const isMember = ['u', 'user', 'space'].indexOf(host) >= 0;
    if (isMember) {
        if (['blog', 'note', 'bulletin', 'doc'].indexOf(path) >= 0) {
            router.navigate(['/frontend/user', path]);
            return 
        }
        router.navigate(['/frontend/user']);
        return 
    }
    const isBackend = ['b', 'admin', 'backend', 'system'].indexOf(host) >= 0;
    if (isBackend) {
        if (path === 'user' && intValidate(params[0])) {
            router.navigate(['/backend/auth/users/edit', params[0]]);
            return;
        }
        if (path === 'friend_link') {
            router.navigate(['/backend/contact/friend-link']);
            return;
        }
        if (path === 'order' && intValidate(params[0])) {
            router.navigate(['/backend/shop/order', params[0]]);
            return;
        }
    }
    router.navigate(['/']);
}