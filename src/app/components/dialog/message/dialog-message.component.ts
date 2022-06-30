import { animate, state, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { Component, HostListener, OnDestroy } from '@angular/core';
import { DialogPackage } from '../dialog.injector';
import { DialogService } from '../dialog.service';
import { DialogMessageOption } from '../model';

interface ITheme {
    icon: string;
    theme?: string;
}

interface IThemeGroup {
    [key: string]: ITheme;
}

@Component({
    selector: 'app-dialog-message',
    templateUrl: './dialog-message.component.html',
    styleUrls: ['./dialog-message.component.scss'],
    animations: [
        trigger('dialogOpen', [
            state('open', style({ opacity: 1 })),
            state('closed', style({ opacity: 0 })),
            transition(
                '* => closed',
                animate('500ms ease-out')
            ),
            transition(
                '* => open',
                animate('500ms ease-in')
            )
        ])
    ]
})
export class DialogMessageComponent implements OnDestroy {

    public icon = '';
    public theme = '';
    public title = '';
    public content = '';
    public visible = true;
    public offset = 0;

    private timeHandle: any;

    public get boxStyle() {
        return {
            top: this.offset + 'px'
        };
    }

    constructor(
        private data: DialogPackage<DialogMessageOption>,
        private service: DialogService,
    ) {
        const option = data.data;
        this.title = option.title || '';
        this.content = option.content || '';
        this.applyTheme(option.type);
        this.timeHandle = setTimeout(() => {
            this.visible = false;
            this.timeHandle = null;
        }, option.time || 2000);
    }

    ngOnDestroy() {
        if (this.timeHandle) {
            clearTimeout(this.timeHandle);
        }
    }

    @HostListener('click')
    public close() {
        this.visible = false;
        if (this.timeHandle) {
            clearTimeout(this.timeHandle);
            this.timeHandle = null;
        }
    }

    public animationDone(event: AnimationEvent) {
        if (event.toState !== 'closed') {
            return;
        }
        this.service.remove(this.data.dialogId);
    }

    private applyTheme(messageType: string) {
        const themeItems: IThemeGroup = {
            success: {
                icon: 'icon-check-circle'
            },
            info: {
                icon: 'icon-exclamation-circle',
            },
            waining: {
                icon: 'icon-exclamation-triangle',
            },
            error: {
                icon: 'icon-close-circle'
            }
        };
        const item = themeItems[messageType];
        this.icon = item?.icon || ('icon-' + messageType);
        this.theme = item?.theme || ('message-' + messageType)
    }

}
