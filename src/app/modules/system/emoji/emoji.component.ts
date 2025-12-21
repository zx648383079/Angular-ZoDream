import { form, required } from '@angular/forms/signals';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { IEmoji, IEmojiCategory } from '../../../theme/models/seo';
import { IPageQueries } from '../../../theme/models/page';
import { SystemService } from '../system.service';
import { DialogBoxComponent, DialogService } from '../../../components/dialog';
import { UploadButtonEvent } from '../../../components/form';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../theme/services';
import { parseNumber } from '../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-emoji',
    templateUrl: './emoji.component.html',
    styleUrls: ['./emoji.component.scss']
})
export class EmojiComponent implements OnInit {
    private readonly service = inject(SystemService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IEmoji[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        page: 1,
        per_page: 20,
        keywords: '',
        category: '0',
    }));
    public categories: IEmojiCategory[] = [];
    public readonly editForm = form(signal({
        id: 0,
        name: '',
        cat_id: '0',
        type: '0',
        content: '',
    }), schemaPath => {
        required(schemaPath.content);
    });
    public readonly typeValue = computed(() => parseNumber(this.editForm.type().value()));
    public readonly isMultiple = signal(false);
    public readonly isChecked = signal(false);

    constructor() {
        this.service.emojiCategoryList({}).subscribe(res => {
            this.categories = res.data;
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public readonly checkedItems = computed(() => {
        return this.items().filter(i => i.checked);
    });

    public toggleMultiple() {
        this.isMultiple.update(v => !v);
    }

    public toggleCheck(item?: IEmoji) {
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
        this.toastrService.confirm(`确认删除选中的${items.length}条反馈？`, () => {
            this.service.emojiRemove(items.map(i => i.id)).subscribe(res => {
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
        if (this.isLoading) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.emojiList(queries).subscribe({
            next: res => {
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapRemove(item: any) {
        this.toastrService.confirm('确定删除“' + item.name + '”表情？', () => {
            this.service.emojiRemove(item.id).subscribe(res => {
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

    public tapView(modal: DialogBoxComponent, item?: any) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.type = item?.type ?? 0;
            v.content = item?.content ?? '';
            return v;
        });
        modal.open(() => {
            this.service.emojiSave(this.editForm().value()).subscribe(res => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapPage();
            });
        }, () => this.editForm().valid());
    }

    public tapImport(modal: DialogBoxComponent) {
        modal.open();
    }

    public uploadFile(event: UploadButtonEvent) {
        const form = new FormData();
        form.append('file', event.files[0]);
        event.enter();
        this.service.emojiImport(form).subscribe({
            next: _ => {
                event.reset();
                this.tapRefresh();
                this.toastrService.success('导入成功！');
            },
            error: err => {
                event.reset();
                this.toastrService.warning(err);
            }
        });
    }

}
