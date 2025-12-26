import { Component, signal } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-pay-result',
    templateUrl: './pay-result.component.html',
    styleUrls: ['./pay-result.component.scss']
})
export class PayResultComponent {

    public readonly log = signal<any>(null);
}
