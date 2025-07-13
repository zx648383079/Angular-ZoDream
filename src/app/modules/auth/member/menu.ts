import { INavLink } from '../../../theme/models/seo';

export const MemberMenu: INavLink[] = [
    {
        name: $localize `Thirdparty App`,
        icon: 'icon-rocket',
        url: 'authorize'
    },
    {
        name: $localize `Account Binding`,
        icon: 'icon-chain',
        url: 'connect'
    },
    {
        name: $localize `Login Drive`,
        icon: 'icon-mobile',
        url: 'driver'
    },
    {
        name: $localize `Setting`,
        icon: 'icon-cog',
        url: 'setting'
    }
];