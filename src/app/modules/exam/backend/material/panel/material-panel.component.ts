import { form, required } from '@angular/forms/signals';
import { Component, inject, input, signal } from '@angular/core';
import { SearchDialogEvent } from '../../../../../components/dialog';
import { ICourse, IQuestionMaterial } from '../../../model';
import { ExamService } from '../../exam.service';

@Component({
    standalone: false,
    selector: 'app-material-panel',
    templateUrl: './material-panel.component.html',
    styleUrls: ['./material-panel.component.scss']
})
export class MaterialPanelComponent implements SearchDialogEvent {
    private readonly service = inject(ExamService);


    public readonly visible = signal(false);
    public readonly items = signal<IQuestionMaterial[]>([]);
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
    public typeItems = ['文本', '音频', '视频'];
    public readonly tabIndex = signal(false);
    public readonly selectedItem = signal<IQuestionMaterial>(null);
    public readonly editForm = form(signal({
        title: '',
        course_id: 0,
        description: '',
        type: 0,
        content: '',
    }), schemaPath => {
        required(schemaPath.title);
    });

    private confirmFn: (items: IQuestionMaterial|IQuestionMaterial[]) => void;
    private checkFn: (items: IQuestionMaterial[]) => boolean;


    public tapSelected(item: IQuestionMaterial) {
        this.selectedItem.set(item);
    }

    public tapAdd() {
        this.tabIndex.update(v => !v);
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
        this.service.materialList(queries).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
            },
            error: _ => {
                this.isLoading.set(true);
            }
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
        this.tabIndex.set(false);
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
        if (this.checkFn && this.checkFn([this.selectedItem()]) === false) {
            return;
        }
        this.visible.set(false);
        const confirmFn = this.confirmFn;
        if (confirmFn) {
            confirmFn(this.selectedItem());
        }
    }

    public open<T>(confirm: (data: T|T[]) => void): void;
    public open<T>(data: any|any[], confirm: (data: T|T[]) => void): void;
    public open<T>(data: any|any[], confirm: (data: T|T[]) => void, check: (data: T[]) => boolean): void;
    /**
     * 显示弹窗
     * @param cb 点击确认按钮事件
     * @param check 判断是否允许关闭
     */
    public open<T>(data: IQuestionMaterial| any, confirm?: (data: IQuestionMaterial) => void, check?: (data: IQuestionMaterial[]) => boolean): void {
        this.confirmFn = confirm;
        this.checkFn = check;
        this.selectedItem.set(data ?? null);
        this.visible.set(true);
    }
}
