import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnChanges {

  @Input() public title = $localize `Tip`;
  @Input() public theme = '';
  @Input() public min = false;
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
