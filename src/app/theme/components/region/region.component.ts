import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'region',
    styleUrls: ['./region.component.scss'],
    templateUrl: 'region.component.html'
})
export class RegionComponent {

    @Input() url: string;

    @Input() canYes: boolean = false;

    @Input() region: any;

    @Output() regionChange = new EventEmitter<any>();

    paths: Array<any> = [{
        name: '请选择'
    }];

    regionItems: Array<any> = [];

    data: any;

    activeIndex: number = 0;

    constructor(private http: HttpClient) {

    }

    ngOnInit() {
        this.http.get(this.url).subscribe((data: any) => {
            this.data = data.data;
            this.regionItems = this._toArray(this.data[1].children);
            this.activeIndex = 0;
        });
    }

    touchIndex(index) {
        this.activeIndex = index;
        this.regionItems = this._getRegionList();
    }

    private _toArray(data: any) {
        let args = [];
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                args.push(data[key]);
            }
        }
        return args;
    }

    private _getRegionList() {
        if (this.activeIndex <= 0) {
            return this._toArray(this.data[1].children);
        }
        return this._toArray(this.paths[this.activeIndex - 1].children);
    }

    isSelected(item) {
        return item.id == this.paths[this.activeIndex].id;
    }

    touchYes() {
        let item = this.paths[this.activeIndex];
        if (!item.id && this.paths.length > 0) {
            item = this.paths[this.paths.length - 1]
        }
        this.regionChange.emit({
            id: item.id,
            name: item.name
        });
    }

    touchSelect(item) {
        this.paths[this.activeIndex] = item;
        this.paths.splice(this.activeIndex + 1);
        if (!item.children || this.activeIndex > 0) {
            this.regionChange.emit({
                id: item.id,
                name: item.name
            });
            return;
        }
        this.paths.push({
            name: '请选择'
        });
        this.activeIndex += 1;
        this.regionItems = this._toArray(item.children);
    }
}