import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-example-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class ExampleHomeComponent implements OnInit {

    public isLoading = true;
    public data: any = {};

    constructor() { }

    ngOnInit() {
        setTimeout(() => {
            this.isLoading = false;
            this.data = {
                user_today: 100,
                user_yesterday: 5,
                user_count: 2000000,
            };
        }, 2000);
    }

}
