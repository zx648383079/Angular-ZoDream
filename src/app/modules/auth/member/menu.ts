import { INav } from '../../../theme/components';

export const MemberMenu: INav[] = [
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