import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

interface ISelectColumn {
    label?: string;
    value?: string|number;
    parent?: string|number;
    keywords?: string;
    focus?: boolean;
    isLoading?: boolean;
    searchable?: boolean;
    items?: any[];
}

@Component({
    selector: 'app-multi-select-input',
    templateUrl: './multi-select-input.component.html',
    styleUrls: ['./multi-select-input.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MultiSelectInputComponent),
        multi: true
    }]
})
export class MultiSelectInputComponent<T = any> implements ControlValueAccessor, OnChanges {

    @Input() public url: string;
    @Input() public placeholder = $localize `Please select...`;
    @Input() public rangeKey = 'id';
    @Input() public rangeLabel = 'name';
    @Input() public searchKey = 'keywords';
    @Input() public multipleLevel = false;
    /**
     * 只有通过url请求的才会触发，参数为http响应内容
     */
    @Input() public formatFn: (data: any) => T[];
    public items: ISelectColumn[] = [
        {items: [], searchable: true}
    ];

    public disabled = false;

    onChange: any = () => {};
    onTouch: any = () => {};

    constructor(
        private http: HttpClient
    ) { }


    ngOnChanges(changes: SimpleChanges): void {
        
    }

    public onKeydown(e: KeyboardEvent, item: ISelectColumn) {
        if (e.code !== 'Enter') {
            return;
        }

    }

    public tapSelect(column: ISelectColumn, option: any) {
        column.label = option.name;
        column.value = option.value;
        column.focus = false;
    }



    writeValue(obj: any): void {
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
