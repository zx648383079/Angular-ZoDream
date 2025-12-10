import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, inject, input, model, viewChild } from '@angular/core';
import { IUser } from '../../../theme/models/user';
import { IPageQueries, IPage } from '../../../theme/models/page';
import { hasElementByClass } from '../../../theme/utils/doc';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-user-picker',
    templateUrl: './user-picker.component.html',
    styleUrls: ['./user-picker.component.scss'],
})
export class UserPickerComponent implements FormValueControl<IUser> {
    private http = inject(HttpClient);


    private readonly inputor = viewChild<ElementRef<HTMLInputElement>>('inputor');
    public readonly placeholder = input($localize `Please input...`);
    
    public readonly disabled = input<boolean>(false);
    public readonly value = model<IUser>();
    public isFocus = false;

    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20
    };
    public items: IUser[] = [];
    public hasMore = false;
    public isLoading = false;
    public total = 0;
    

    @HostListener('document:click', ['$event']) 
    public hideCalendar(event: any) {
        if (!event.target.closest('.user-picker') && !hasElementByClass(event.path, 'user-picker')) {
            this.isFocus = false;
        }
    }

    public tapOpen() {
        if (this.disabled()) {
            return;
        }
        this.isFocus = true;
        this.inputor().nativeElement.focus();
    }

    public tapItem(item: IUser) {
        this.output(item);
    }

    public tapClear() {
        this.output();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.http.get<IPage<IUser>>('auth/admin/user/search', {params: queries}).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.queries = queries;
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    private output(v?: IUser) {
        this.value.set(v);
    }

}
