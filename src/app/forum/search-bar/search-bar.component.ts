import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

    @Input() public keywords = '';
    @Input() public type = 0;
    @Output() public confirm = new EventEmitter<any>();

    public typeItems = [
        '全部', '本版', '用户'
    ];

    constructor() { }


    public tapSearch() {
        this.confirm.emit({type: this.type, keywords: this.keywords});
    }
}
