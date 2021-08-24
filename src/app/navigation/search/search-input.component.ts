import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent {

    @Input() public value = '';
    public suggestItems: string[] = [];
    public histories: string[] = [];
    public openType = 0;

    constructor() { }

}
