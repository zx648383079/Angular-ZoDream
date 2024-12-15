import { Component, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IPageQueries } from '../../../../../theme/models/page';
import { IAddress } from '../../../model';
import { OrderService } from '../order.service';

@Component({
    standalone: false,
    selector: 'app-address-picker',
    templateUrl: './address-picker.component.html',
    styleUrls: ['./address-picker.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AddressPickerComponent),
        multi: true
    }]
})
export class AddressPickerComponent implements ControlValueAccessor, OnChanges {

    @Input() public user = 0;
    public value: IAddress;
    public disabled = false;
    public isFocus = false;
    public editable = false;

    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20
    };
    public items: IAddress[] = [];
    public hasMore = false;
    public isLoading = false;
    public total = 0;
    
    onChange: any = () => {};
    onTouch: any = () => {};


    constructor(
        private service: OrderService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.user && changes.user.currentValue > 0) {
            this.tapRefresh();
        }
    }

    public toggleEdit() {
        this.editable = !this.editable;
        if (!this.editable) {
            return;
        }
        if (this.value) {
            this.output({...this.value, id: 0});
            return;
        }
        this.output({
            region_id: 0,
            name: '',
            address: '',
            tel: '',
        } as any);
    }

    public tapItem(item: IAddress) {
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
        const queries = {...this.queries, page, user: this.user};
        this.service.addressSearch(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.queries = queries;
                if (this.items.length < 1 && this.total < 1) {
                    this.toggleEdit();
                }
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    private output(v?: IAddress) {
        this.value = v;
        this.onChange(this.value);
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
