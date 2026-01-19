import { Component, input, signal } from '@angular/core';
import { SearchDialogEvent } from '../../../../components/dialog';
import { form } from '@angular/forms/signals';
import { ICourse, IExamPage, IQuestion, QuestionTypeItems } from '../../model';
import { mapFormat } from '../../../../theme/utils';
import { Observable } from 'rxjs';
import { IPage } from '../../../../theme/models/page';

@Component({
    standalone: false,
    selector: 'app-question-finder',
    templateUrl: './question-dialog.component.html',
    styleUrls: ['./question-dialog.component.scss']
})
export class QuestionFinderComponent implements SearchDialogEvent {
    public readonly visible = signal(false);
    public readonly items = signal<IQuestion[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        page: 1,
        per_page: 20,
        keywords: '',
        course: '0',
    }));
    public readonly courseItems = input<ICourse[]>([]);
    public readonly selectedItems = signal<IQuestion[]>([]);

    private confirmFn: (items: IQuestion[]) => void;
    private checkFn: (items: IQuestion[]) => boolean;
    private queryFn: (params: any) => Observable<IPage<IQuestion | IExamPage>>;

    public formatQuestionType(value: number) {
        return mapFormat(value, QuestionTypeItems);
    }

    public isSelected(item: IQuestion) {
        const items = this.selectedItems();
        for (const i of items) {
            if (i.id === item.id) {
                return true;
            }
        }
        return false;
    }

    public tapSelected(item: IQuestion) {
        this.selectedItems.update(v => {
            for (let i = 0; i < v.length; i++) {
                if (item.id === v[i].id) {
                    v.splice(i, 1);
                    return [...v];
                }
            }
            v.push(item);
            return [...v];
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.queryFn(queries).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data as any);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    /**
     * 关闭弹窗
     * @param result 
     * @returns 
     */
    public close(result?: any) {
        if (typeof result === 'undefined') {
            this.visible.set(false);
            return;
        }
        if (!result) {
            this.visible.set(false);
            return;
        }
        if (this.checkFn && this.checkFn(this.selectedItems()) === false) {
            return;
        }
        this.visible.set(false);
        const confirmFn = this.confirmFn;
        if (confirmFn) {
            confirmFn(this.selectedItems());
        }
    }

    public open<T>(confirm: (data: T|T[]) => void): void;
    public open<T>(data: any|any[], confirm: (data: T|T[]) => void): void;
    public open<T>(data: any|any[], confirm: (data: T|T[]) => void, check: (data: T[]) => boolean): void;
    public open<T>(data: any|any[], confirm: (data: T|T[]) => void, check: (data: T[]) => boolean, queryFn: Function): void;
    /**
     * 显示弹窗
     * @param cb 点击确认按钮事件
     * @param check 判断是否允许关闭
     */
    public open<T>(data: IQuestion[]|any, 
        confirm?: (data: IQuestion[]) => void, 
        check?: (data: IQuestion[]) => boolean, queryFn?: Function): void {
        this.confirmFn = confirm;
        this.checkFn = check;
        this.queryFn = queryFn as any;
        this.selectedItems.set(data ?? []);
        this.visible.set(true);
    }
}
