import { Component, OnInit } from '@angular/core';
import { MemberService } from '../member.service';

@Component({
    standalone: false,
    selector: 'app-member-authorize',
    templateUrl: './authorize.component.html',
    styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent implements OnInit {

    public items: any[] = [];
    public isLoading = false;

    constructor(
        private service: MemberService
    ) { }

    ngOnInit() {
        this.tapRefresh();
    }

    public tapRefresh() {
        this.isLoading = true;
        this.service.authorizeAppList().subscribe({
            next: res => {
                this.items = res.data;
                this.isLoading = false;
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

}
