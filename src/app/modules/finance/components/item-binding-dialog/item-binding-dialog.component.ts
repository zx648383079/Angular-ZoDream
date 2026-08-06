import { Component, inject, OnInit, signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';
import { FinanceService } from '../../finance.service';
import { IItem } from '../../model';

@Component({
    standalone: false,
    selector: 'app-item-binding-dialog',
    templateUrl: './item-binding-dialog.component.html',
    styleUrls: ['./item-binding-dialog.component.scss']
})
export class ItemBindingDialogComponent {

    private readonly service = inject(FinanceService);

    public readonly isInput = signal(false);
    public readonly queries = form(signal({
        keywords: '',
        page: 1,
        per_page: 10
    }));
    public readonly hasMore = signal(false);
    public readonly items = signal<IItem[]>([]);
    public readonly tabIndex = signal(0);
    public readonly visible = signal(false);
    public readonly selectedItems = signal<IItem[]>([]);

    public readonly editForm = form(signal({
        name: '',
        remark: '',
    }), schemaPath => {
        required(schemaPath.name);
    });

    private confirmFn?: Function;


    public open(cb: (data: any) => void) {
        this.visible.set(true);
        this.confirmFn = cb;
    }

    public close() {
        this.visible.set(false);
    }

    public tapYes() {
        this.visible.set(false);
        if (this.tabIndex() > 0) {
            if (this.selectedItems().length === 0) {
                return;
            }
            this.confirmFn!({
                id: this.selectedItems().map(i => i.id).join(',')
            });
            return;
        }
        if (this.editForm().invalid()) {
            return;
        }
        this.confirmFn!(this.editForm().value());
    }
    public tapCancel() {
        this.close();
    }

    public isSelected(item: IItem) {
        const items = this.selectedItems();
        for (const i of items) {
            if (i.id === item.id) {
                return true;
            }
        }
        return false;
    }

    public tapSelected(item: IItem) {
        this.selectedItems.set([item]);
    }

    public tapSearchTab(i: number) {
        this.tabIndex.set(i);
        this.goPage(1);
    }

    public tapSearchInput() {
        this.isInput.set(true);
    }

    public tapSearchClear() {
        this.queries.keywords().value.set('');
        this.isInput.set(false);
    }

    public onSearchKeyDown(event: KeyboardEvent) {
        if (event.key !== 'Enter') {
            return;
        }
        this.goPage(1);
    }

    public tapPrevious() {
        const page = this.queries.page().value();
        if (page < 2) {
            return;
        }
        this.goPage(page - 1);
    }

    public tapNext() {
        if (!this.hasMore()) {
            return;
        }
        this.goPage(this.queries.page().value() + 1);
    }

    private goPage(page: number) {
        const queries = {...this.queries().value(), page};
        this.service.itemList(queries).subscribe(res => {
            this.items.set(res.data);
            this.queries().value.set(queries);
            this.hasMore.set(res.paging.more);
        });
    }

}
