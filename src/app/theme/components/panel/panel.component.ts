import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit, OnChanges {

  @Input() public title = '提示';
  @Input() public theme = '';
  @Input() public min = false;
  public isOpen = true;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.min) {
      this.isOpen = !changes.min.currentValue;
    }
  }

  public tapToggle() {
    this.isOpen = !this.isOpen;
  }

}
