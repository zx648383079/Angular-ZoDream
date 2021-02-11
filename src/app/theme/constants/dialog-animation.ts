import { animate, state, style, transition, trigger } from '@angular/animations';

export const DialogAnimation = trigger('dialogOpen', [
    state('open', style({
        transform: 'translate3d(0, 0, 0)',
        opacity: 1,
    })),
    state('closed', style({
        transform: 'translate3d(0, -1000px, 0)',
        opacity: 0,
    })),
    transition('* => closed', [
        animate('1s')
    ]),
    transition('* => open', [
        animate('0.5s')
    ]),
]);
