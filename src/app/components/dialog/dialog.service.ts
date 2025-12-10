import { ComponentRef, inject, Injectable, Injector, Type, ViewContainerRef } from '@angular/core';
import { IErrorResponse, IErrorResult } from '../../theme/models/page';
import { DialogConfirmComponent } from './confirm/dialog-confirm.component';
import { DialogInjector, DialogPackage } from './dialog.injector';
import { DialogLoadingComponent } from './loading/dialog-loading.component';
import { DialogMessageComponent } from './message/dialog-message.component';
import { DialogConfirmOption, DialogMessageOption, DialogNotifyOption, DialogTipOption, DialogLoadingOption, DialogLeadTour } from './model';
import { DialogLeadComponent } from './lead/dialog-lead.component';



interface IDialogRef {
    id: any;
    isMessage: boolean;
    element: ComponentRef<any>;
}

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    private static guid: number = 0; // id标记
    private readonly messageOuterHeight = 60;
    private messageCount = 0;
    
    private dialogItems: IDialogRef[] = [];
    public containerRef: ViewContainerRef;
    private injector = inject(Injector);

    private formatError(error: string|IErrorResult|IErrorResponse): string {
        if (typeof error != 'object') {
            return error;
        }
        if (error.error && typeof error.error === 'object') {
            return (error as IErrorResult).error.message;
        }
        return (error as IErrorResponse).message;
    }

    public error(message: string|IErrorResponse) {
        this.createMessage({
            content: this.formatError(message),
            type: 'error'
        });
    }

    public warning(message: string|IErrorResponse) {
        this.createMessage({
            content: this.formatError(message),
            type: 'waining'
        });
    }

    public success(message: string) {
        this.createMessage({
            content: this.formatError(message),
            type: 'success'
        });
    }

    public tip(content: string): void;
    public tip(content: string, time: number): void;
    public tip(option: DialogTipOption): void;
    public tip(option: string|DialogTipOption, time = 2000) {
        const opt = typeof option === 'object' ? option : {
            content: option,
            time,
        };
        this.createMessage({
            content: opt.content,
            time: opt.time,
            type: 'info'
        });
    }

    public confirm(content: string, onConfirm: () => void): void;
    public confirm(option: DialogConfirmOption): void;
    public confirm(option: DialogConfirmOption|string, onConfirm?: () => void) {
        const opt = typeof option === 'object' ? option : {
            content: option,
            onConfirm,
        };
        this.createDailog(DialogConfirmComponent, opt);
    }

    /**
     * 加载loading
     * @param option 
     * @returns loading 的id, 使用 remove(id: any) 进行关闭
     */
    public loading(option?: DialogLoadingOption): any {
        return this.createDailog(DialogLoadingComponent, {
            time: 2000,
            closeable: true,
            ...option
        });
    }

    public tour(option: DialogLeadTour) {
        return this.createDailog(DialogLeadComponent, <DialogLeadTour>{
            backText: $localize `Back`,
            nextText: $localize `Next`,
            confirmText: $localize `Done`,
            cancelText: $localize `Close`,
            ...option
        });
    }

    private createMessage(option: DialogMessageOption): any {
        return this.createDailog(DialogMessageComponent, option);
    }

    public notify(option: DialogNotifyOption) {
        Notification.requestPermission().then(permission => {
            if (permission !== 'granted') {
                return;
            }
            new Notification(option.title, {
                body: option.content,
                icon: option.icon,
            })
        });
    }

    public remove(id: any) {
        for (let i = this.dialogItems.length - 1; i >= 0; i--) {
            const element = this.dialogItems[i];
            if (element.id === id) {
                this.removeAt(i);
                break;
            }
        }
    }

    /**
     * 创建组件
     * @param component 
     * @param option 
     * @returns 
     */
    private createDailog<T>(component: Type<T>, option: any): any {
        const dialogId = ++ DialogService.guid;
        if (!this.containerRef) {
            return;
        }
        const dialogInjector = new DialogInjector(new DialogPackage(option, dialogId), this.injector);
        const dialogRef = this.containerRef.createComponent(component, {
            injector: dialogInjector
        });
        const isMessage = this.isMessage(dialogRef);
        this.dialogItems.push({
            id: dialogId,
            isMessage,
            element: dialogRef
        });
        if (isMessage) {
            (dialogRef as any).instance.offset = this.messageOuterHeight * this.messageCount;
            this.messageCount ++;
        }
        return dialogId;
    }
    /**
     * 删除组件
     * @param i 
     */
    private removeAt(i: number) {
        const item = this.dialogItems[i];
        this.dialogItems.splice(i, 1);
        const dialogRef = item.element;
        dialogRef.destroy();
        if (item.isMessage) {
            this.messageCount --;
            this.refreshMessage();
        }
    }

    private refreshMessage() {
        if (this.messageCount <= 0) {
            this.messageCount = 0;
            return;
        }
        let i = -1;
        for (const item of this.dialogItems) {
            if (!item.isMessage) {
                continue;
            }
            i ++;
            (item.element as any).instance.offset = this.messageOuterHeight * i;
        }
    }

    private isMessage(ref: IDialogRef|ComponentRef<any>|DialogMessageComponent) {
        if (ref instanceof DialogMessageComponent) {
            return true;
        }
        if (ref instanceof ComponentRef) {
            return ref.instance instanceof DialogMessageComponent;
        }
        if (ref.id && ref.element) {
            return ref.element.instance instanceof DialogMessageComponent;
        }
        return false;
    }
}
