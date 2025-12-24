import { Component, HostListener, OnDestroy, computed, inject, signal } from '@angular/core';
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
    standalone: false,
    selector: 'app-dialog-message',
    templateUrl: './dialog-message.component.html',
    styleUrls: ['./dialog-message.component.scss'],
})
export class DialogMessageComponent implements OnDestroy {
    private readonly data = inject<DialogPackage<DialogMessageOption>>(DialogPackage);
    private readonly service = inject(DialogService);


    public icon = '';
    public theme = '';
    public title = '';
    public content = '';
    public readonly visible = signal(true);
    public readonly offset = signal(0);

    private timeHandle: any;

    public readonly boxStyle = computed(() => {
        return {
            top: this.offset() + 'px'
        };
    });

    constructor() {
        const data = this.data;
        const option = data.data;
        this.title = option.title || '';
        this.content = option.content || '';
        this.applyTheme(option.type);
        this.timeHandle = setTimeout(() => {
            this.visible.set(false);
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
        this.visible.set(false);
        if (this.timeHandle) {
            clearTimeout(this.timeHandle);
            this.timeHandle = null;
        }
    }

    public animationDone() {
        if (this.visible()) {
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
