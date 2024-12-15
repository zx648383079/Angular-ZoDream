import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-bulletin-send',
    templateUrl: './bulletin-send.component.html',
    styleUrls: ['./bulletin-send.component.scss']
})
export class BulletinSendComponent implements OnInit {

    @ViewChild('box') box: ElementRef;
    public lastUsers: any[] = [];
    public users: any[] = [];
    public messages: any[] = [];
    public currentUser: any;
    public hasMore = false;
    public isList = false;
    public page = 0;
    public content = '';

    constructor() { }

    ngOnInit() {
    }

    public change(user: any) {
        this.currentUser = user;
        this.page = 0;
        this.messages = [];
        this.getMore();
    }

    public getMore() {
        // this.service.getMessage(this.currentUser['user_id'], ++this.page).subscribe(data => this.messages.push(...data));
    }

    public send() {
        // this.service.sendMessage(this.currentUser['user_id'], this.content).subscribe(data=> {
        //   if (data.code == 0) {
        //     this.content = '';
        //     this.scroll();
        //     this.messages.push(data.data);
        //   }
        // });
    }

    public scroll(y: number = -1) {
        if (!this.box.nativeElement) {
            return;
        }
        if (y < 0) {
            y = this.box.nativeElement.scrollHeight + 100;
        }
        this.box.nativeElement.scrollTop = y;
    }

}
