import { HttpClient } from '@angular/common/http';
import { Component, inject, input, model, signal } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

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
    standalone: false,
    selector: 'app-multi-select-input',
    templateUrl: './multi-select-input.component.html',
    styleUrls: ['./multi-select-input.component.scss'],
})
export class MultiSelectInputComponent<T = any> implements FormValueControl<T> {
    private readonly http = inject(HttpClient);


    public readonly url = input<string>(undefined);
    public readonly placeholder = input($localize `Please select...`);
    public readonly rangeKey = input('id');
    public readonly rangeLabel = input('name');
    public readonly searchKey = input('keywords');
    public readonly multipleLevel = input(false);
    /**
     * 只有通过url请求的才会触发，参数为http响应内容
     */
    public readonly formatFn = input<(data: any) => T[]>(undefined);
    public readonly items = signal<ISelectColumn[]>([
        {items: [], searchable: true}
    ]);

    public readonly disabled = input<boolean>(false);
    public readonly value = model<T>();

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
}
