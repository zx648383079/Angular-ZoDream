import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { IUser } from '../../../theme/models/user';
import { IPageQueries, IPage } from '../../../theme/models/page';
import { hasElementByClass } from '../../../theme/utils/doc';

@Component({
    standalone: false,
    selector: 'app-user-picker',
    templateUrl: './user-picker.component.html',
    styleUrls: ['./user-picker.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => UserPickerComponent),
        multi: true
    }]
})
export class UserPickerComponent implements ControlValueAccessor {

    @ViewChild('inputor')
    private inputor: ElementRef<HTMLInputElement>;
    @Input() public placeholder = $localize `Please input...`;
    
    public value: IUser;
    public disabled = false;
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
    
    @Output() public valueChange = new EventEmitter<IUser|undefined>()
    onChange: any = () => {};
    onTouch: any = () => {};


    constructor(
        private http: HttpClient
    ) { }

    @HostListener('document:click', ['$event']) 
    public hideCalendar(event: any) {
        if (!event.target.closest('.user-picker') && !hasElementByClass(event.path, 'user-picker')) {
            this.isFocus = false;
            this.onTouch();
        }
    }

    public tapOpen() {
        if (this.disabled) {
            return;
        }
        this.isFocus = true;
        this.inputor.nativeElement.focus();
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
        this.value = v;
        this.onChange(this.value);
        this.valueChange.emit(this.value);
    }

    writeValue(obj: any): void {
        this.value = obj;
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

}
