import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-tip',
  templateUrl: './page-tip.component.html',
  styleUrls: ['./page-tip.component.scss']
})
export class PageTipComponent {

  @Input() public title = '提示';

  public isMin = false;

  public tapMin() {
    this.isMin = !this.isMin;
  }

}
