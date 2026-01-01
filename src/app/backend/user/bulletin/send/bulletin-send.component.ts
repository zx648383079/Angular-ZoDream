import { Component, OnInit, ElementRef, viewChild, signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-bulletin-send',
    templateUrl: './bulletin-send.component.html',
    styleUrls: ['./bulletin-send.component.scss']
})
export class BulletinSendComponent {

    private readonly box = viewChild<ElementRef>('box');
    public readonly lastUsers = signal<any[]>([]);
    public readonly users = signal<any[]>([]);
    public readonly messages = signal<any[]>([]);
    public readonly currentUser = signal<any>(null);
    public readonly hasMore = signal(false);
    public readonly isListMode = signal(false);
    public page = 0;
    public readonly dataForm = form(signal({
        content: ''
    }), schemaPath => {
        required(schemaPath.content);
    });

    public change(user: any) {
        this.currentUser.set(user);
        this.page = 0;
        this.messages.set([]);
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
        const box = this.box();
        if (!box.nativeElement) {
            return;
        }
        if (y < 0) {
            y = box.nativeElement.scrollHeight + 100;
        }
        box.nativeElement.scrollTop = y;
    }

}
