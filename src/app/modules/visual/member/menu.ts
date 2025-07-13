import { INavLink } from '../../../theme/models/seo';

export const VisualMemberMenu: INavLink[] = [
    {
        name: $localize `My Components`,
        icon: 'icon-zuhe',
        url: './',
    },
    {
        name: $localize `My Sites`,
        icon: 'icon-globe',
        url: './site',
    },
];