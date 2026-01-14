import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { IPageQueries } from '../../../theme/models/page';
import { IBlackWord } from '../../../theme/models/seo';
import { SearchService } from '../../../theme/services';
import { emptyValidate } from '../../../theme/validators';
import { SystemService } from '../system.service';

@Component({
    standalone: false,
    selector: 'app-system-word',
    templateUrl: './word.component.html',
    styleUrls: ['./word.component.scss']
})
export class WordComponent implements OnInit {
    private readonly service = inject(SystemService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IBlackWord[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: ''
    }));
    public readonly editForm = form(signal<IBlackWord>({
        id: 0, 
        words: '', 
        replace_words: ''
    }), schemaPath => {
        required(schemaPath.words);
    });

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
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
        this.service.wordList(queries).subscribe({
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

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: IBlackWord) {
        this.toastrService.confirm('确定删除“' + item.words + '”屏蔽词？', () => {
            this.service.wordRemove(item.id).subscribe(res => {
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

    open(modal: DialogEvent, item?: IBlackWord) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.words = item?.words ?? '';
            v.replace_words = item?.replace_words ?? '';
            return {...v};
        });
        modal.open(() => {
            this.service.wordSave(Object.assign({}, this.editForm)).subscribe(res => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapPage();
            });
        }, () => this.editForm().valid());
    }

}
