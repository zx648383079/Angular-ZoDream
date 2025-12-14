import { Component, OnInit, inject } from '@angular/core';
import { MemberService } from '../member.service';

@Component({
    standalone: false,
    selector: 'app-member-authorize',
    templateUrl: './authorize.component.html',
    styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent implements OnInit {
    private readonly service = inject(MemberService);


    public items: any[] = [];
    public isLoading = false;

    ngOnInit() {
        this.tapRefresh();
    }

    public tapBack() {
        history.back();
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
