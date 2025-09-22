import { Component } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
    standalone: false,
    selector: 'app-chat-search-dialog',
    templateUrl: './search-dialog.component.html',
    styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent {

    public isInput = false;
    public keywords = '';
    public items = [];
    public tabIndex = 0;
    public visible = false;

    private confirmFn: Function;

    constructor(
        private service: ChatService
    ) {
    }


    public open(cb: () => void) {
        this.visible = true;
        this.confirmFn = cb;
    }

    public close() {
        this.visible = false;
        this.confirmFn();
    }

    // public tapAdd(event: Event) {
    //     event.stopPropagation();
    //     searchModal.openCustom(item => {
    //         if (!item) {
    //             return;
    //         }
    //         this.editProfile.user = item;
    //         this.editProfile.editable = false;
    //         this.profileModal.open(() => {
    //             this.groupModal.open(() => {
    //                 this.request.emit(COMMAND_FRIEND_APPLY, {
    //                     user: item.id,
    //                     group: this.editClassify.id,
    //                     remark: this.editProfile.remark
    //                 });
    //             });
    //         });
    //     });
    // }

    public tapSearchTab(i: number) {
        this.tabIndex = i;
    }

    public tapSearchInput() {
        this.isInput = true;
    }

    public tapSearchClear() {
        this.keywords = '';
        this.isInput = false;
    }

    public onSearchKeyDown(event: KeyboardEvent) {
        if (event.key !== 'Enter') {
            return;
        }
        this.service.search({
            keywords: this.keywords
        }).subscribe(res => {
            this.items = res.data;
        });
    }

}
