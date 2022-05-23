import { DOCUMENT } from '@angular/common';
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Inject, Injectable, Injector, Type } from '@angular/core';
import { DialogLoadingOption } from '.';
import { IErrorResponse, IErrorResult } from '../../theme/models/page';
import { DialogConfirmComponent } from './confirm/dialog-confirm.component';
import { DialogInjector, DialogPackage } from './dialog.injector';
import { DialogLoadingComponent } from './loading/dialog-loading.component';
import { DialogMessageComponent } from './message/dialog-message.component';
import { DialogConfirmOption, DialogMessageOption, DialogNotifyOption, DialogTipOption } from './model';

interface IDialogRef {
    id: any;
    element: ComponentRef<any>;
}

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    private static guid: number = 0; // id标记
    private dialogItems: IDialogRef[] = [];

    constructor(
        private resolver: ComponentFactoryResolver,
        private applicationRef: ApplicationRef,
        private injector: Injector, 
        @Inject(DOCUMENT) private document: Document,
    ) { }

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
        option = Object.assign({}, option, {
            time: 2000,
            closeable: true,
        });
        return this.createDailog(DialogLoadingComponent, option);
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
            }
        }
    }

    private createDailog<T>(component: Type<T>, option: any): any {
        const dialogId = ++ DialogService.guid;
        const dialogFactory = this.resolver.resolveComponentFactory(component);
        const dialogInjector = new DialogInjector(new DialogPackage(option, dialogId), this.injector);
        const dialogRef = dialogFactory.create(dialogInjector);
        this.applicationRef.attachView(dialogRef.hostView);
        this.document.body.appendChild(dialogRef.location.nativeElement);
        this.dialogItems.push({
            id: dialogId,
            element: dialogRef
        });
        return dialogId;
    }

    private removeAt(i: number) {
        const item = this.dialogItems[i];
        const dialogRef = item.element;
        this.applicationRef.detachView(dialogRef.hostView);
        this.document.body.removeChild(dialogRef.location.nativeElement);
        this.dialogItems.splice(i);
    }
}
