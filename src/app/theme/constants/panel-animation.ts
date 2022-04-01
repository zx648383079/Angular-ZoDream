import { animate, state, style, transition, trigger } from '@angular/animations';

export const PanelAnimation = trigger('panelOpen', [
    state('open', style({
        right: '0px',
        opacity: 1,
    })),
    state('closed', style({
        right: '-30rem',
        opacity: 0,
    })),
    transition('* => closed', [
        animate('1s')
    ]),
    transition('* => open', [
        animate('0.5s')
    ]),
]);
