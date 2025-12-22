import { form, required } from '@angular/forms/signals';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { INote } from '../../model';
import { NoteService } from '../note.service';
import { emptyValidate } from '../../../../theme/validators';

@Component({
    standalone: false,
    selector: 'app-note-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
    private readonly service = inject(NoteService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<INote[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20,
        user: 0,
    }));
    public readonly editForm = form(signal({
        id: 0,
        content: '',
        is_notice: 1
    }), schemaPath => {
        required(schemaPath.content);
    });
    public readonly isMultiple = signal(false);
    public readonly isChecked = signal(false);

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }


    public open(modal: DialogEvent, item?: INote) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.content = item?.content ?? '';
            v.is_notice = item?.is_notice ?? 1;
            return v;
        });
        modal.open(() => {
            this.service.noteSave(this.editForm().value()).subscribe({
                next: () => {
                    this.toastrService.success($localize `Save Successfully`);
                    if (item) {
                        this.tapPage();
                    } else {
                        this.tapRefresh();
                    }
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => this.editForm().valid());
    }

    public tapUser(user: number) {
        this.queries.user().value.set(user);
        this.tapRefresh();
    }

    public onNoticeToggle(item: INote) {
        this.service.noteChange(item.id, ['is_notice']).subscribe(res => {
            item.is_notice = res.is_notice;
        });
    }


    public readonly checkedItems = computed(() => {
        return this.items().filter(i => i.checked);
    });

    public toggleMultiple() {
        this.isMultiple.update(v => !v);
    }

    public toggleCheck(item?: INote) {
        if (!item) {
            this.isChecked.update(v => !v);
            const isChecked = this.isChecked();
            this.items.update(v => {
                return v.map(i => {
                    i.checked = isChecked;
                    return i;
                });
            });
            return;
        }
        item.checked = !item.checked;
        if (!item.checked) {
            this.isChecked.set(false);
            return;
        }
        if (this.checkedItems().length === this.items().length) {
            this.isChecked.set(true);
        }
    }

    public tapRemoveMultiple() {
        const items = this.checkedItems();
        if (items.length < 1) {
            this.toastrService.warning($localize `No item selected!`);
            return;
        }
        this.toastrService.confirm(`确认删除选中的${items.length}条便签？`, () => {
            this.service.noteRemove(items.map(i => i.id)).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.tapPage();
            });
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page().value() + 1);
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.noteList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.items.set(res.data);
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapRemove(item: INote) {
        this.toastrService.confirm('确定删除“' + item.id + '”便签？', () => {
            this.service.noteRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });
        });
    }

}
