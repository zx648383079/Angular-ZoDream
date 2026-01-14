import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { INote } from '../model';
import { IPageQueries } from '../../../theme/models/page';
import { NoteService } from './note.service';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-note-member',
    templateUrl: './note-member.component.html',
    styleUrls: ['./note-member.component.scss']
})
export class NoteMemberComponent implements OnInit {
    private readonly service = inject(NoteService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<INote[]>([]);
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20,
    }));
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly editForm = form(signal({
        id: 0,
        content: ''
    }), schemaPath => {
        required(schemaPath.content);
    });

    ngOnInit() {
        this.route.queryParams.subscribe(res => {
            this.searchService.getQueries(res, this.queries().value());
            this.tapPage();
        });
    }

    public tapBack() {
        history.back();
    }

    public tapEdit(modal: DialogEvent, item?: INote) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.content = item?.content ?? '';
            return {...v};
        });
        modal.open(() => {
            this.service.noteSave(this.editForm().value()).subscribe({
                next: () => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapPage();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => this.editForm().valid());
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

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapRemove(item: INote) {
        this.toastrService.confirm($localize `Are you sure to delete the content?`, () => {
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
