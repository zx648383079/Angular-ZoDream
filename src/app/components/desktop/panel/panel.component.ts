import { Component, OnChanges, OnInit, SimpleChanges, input } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnChanges {

    public readonly title = input($localize `Tip`);
    public readonly theme = input('');
    public readonly min = input(false);
    public isOpen = true;

    ngOnChanges(changes: SimpleChanges) {
        if (changes.min) {
            this.isOpen = !changes.min.currentValue;
        }
    }

    public tapToggle() {
        this.isOpen = !this.isOpen;
    }

}
