import { Component, OnInit } from '@angular/core';
import { IConnect } from '../../../../theme/models/auth';

@Component({
  selector: 'app-account-center',
  templateUrl: './account-center.component.html',
  styleUrls: ['./account-center.component.scss']
})
export class AccountCenterComponent implements OnInit {

    public items: IConnect[] = [];

    constructor() { }

    ngOnInit() {
    }

}
