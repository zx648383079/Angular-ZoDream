import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, inject, input, model, signal, viewChild } from '@angular/core';
import { IUser } from '../../../theme/models/user';
import { IPageQueries, IPage } from '../../../theme/models/page';
import { isParentOf } from '../../../theme/utils/doc';
import { form, FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-user-picker',
    templateUrl: './user-picker.component.html',
    styleUrls: ['./user-picker.component.scss'],
})
export class UserPickerComponent implements FormValueControl<IUser> {
    private readonly http = inject(HttpClient);
    private readonly elementRef = inject(ElementRef);


    private readonly inputor = viewChild<ElementRef<HTMLInputElement>>('inputor');
    public readonly placeholder = input($localize `Please input...`);

    public readonly disabled = input<boolean>(false);
    public readonly value = model<IUser>();
    public readonly isFocus = signal(false);

    public readonly queries = signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20
    });
    public readonly items = signal<IUser[]>([]);
    private hasMore = false;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);


    @HostListener('document:click', ['$event'])
    public hideCalendar(event: MouseEvent) {
        if (isParentOf(event.target as Node, this.elementRef.nativeElement) < 0) {
            this.isFocus.set(false);
        }
    }

    public tapOpen() {
        if (this.disabled()) {
            return;
        }
        this.isFocus.set(true);
        this.inputor().nativeElement.focus();
    }

    public tapItem(item: IUser) {
        this.value.set(item);
    }

    public tapClear() {
        this.value.set(null)
    }

    public onKeywordsChange(e: Event) {
        this.queries.update(v => {
            v.keywords = (e.target as HTMLInputElement).value;
            return {...v};
        });
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        this.goPage(this.queries().page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries(), page};
        this.http.get<IPage<IUser>>('auth/admin/user/search', {params: queries}).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.queries.set(queries);
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }

}
