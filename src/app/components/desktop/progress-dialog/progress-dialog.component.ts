import { Component, computed, DestroyRef, inject, input, model, signal } from '@angular/core';
import { ButtonEvent } from '../../form';
import { asyncScheduler, filter, Subject, throttleTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpProgressEvent } from '@angular/common/http';

@Component({
    standalone: false,
    selector: 'app-progress-dialog',
    templateUrl: './progress-dialog.component.html',
    styleUrls: ['./progress-dialog.component.scss']
})
export class ProgressDialogComponent implements ButtonEvent {

    private readonly destroyRef = inject(DestroyRef);
    
    /**
     * 标题
     */
    public readonly title = model($localize `Downloading`);
    public readonly placeholder = input($localize `Downloading in progress. Please wait...`);
    /**
     * 是否显示
     */
    public readonly visible = signal(false);
    public readonly isLoading = signal(true);
    public readonly max = signal(0);
    public readonly value = signal(0);

    private readonly progress$ = new Subject<HttpProgressEvent>();


    public readonly progressStyle = computed(() => {
        const max = this.max();
        const value = this.value();
        return {
            width: max > 0 ? (value * 100 / max).toFixed(2) + '%' : '0',
        };
    });

    constructor() {
        this.progress$.pipe(
            throttleTime(100, asyncScheduler, { leading: false, trailing: true }),
            filter(_ => this.visible()),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(res => {
            this.value.set(res.loaded);
            this.max.set(res.total ?? 0);
            if (!res.total) {
                this.isLoading.set(true);
                return;
            }
            this.isLoading.set(false);
        });
    }

    /**
     * 关闭弹窗
     * @param result 
     * @returns 
     */
    public close() {
        this.visible.set(false);
    }

    /**
     * 显示弹窗
     * @param cb 点击确认按钮事件
     * @param check 判断是否允许关闭
     */
    public open(title?: string): Subject<HttpProgressEvent> {
        if (title) {
            this.title.set(title);
        }
        this.visible.set(true);
        return this.progress$;
    }

    public enter() {
        this.isLoading.set(true);
    }
    public reset() {
        this.isLoading.set(false);
    }
}
