import { Component, OnInit } from '@angular/core';
import { FinanceService } from '../finance.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(
        private service: FinanceService,
    ) { }

    ngOnInit() {
    }

}
