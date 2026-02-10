import { Component, OnInit, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { MemberService } from '../member.service';

@Component({
    standalone: false,
    selector: 'app-member-authorize',
    templateUrl: './authorize.component.html',
    styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent implements OnInit {
    private readonly service = inject(MemberService);
    private readonly location = inject(Location);

    public readonly items = signal<any[]>([]);
    public readonly isLoading = signal(false);

    ngOnInit() {
        this.tapRefresh();
    }

    public tapBack() {
        this.location.back();
    }

    public tapRefresh() {
        this.isLoading.set(true);
        this.service.authorizeAppList().subscribe({
            next: res => {
                this.items.set(res.data);
                this.isLoading.set(false);
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }

}
