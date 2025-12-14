import { Component, OnInit, inject } from '@angular/core';
import { DialogService } from '../../../components/dialog';
import { IItem } from '../../../theme/models/seo';
import { SystemService } from '../system.service';
import { ButtonEvent } from '../../../components/form';

@Component({
    standalone: false,
    selector: 'app-cache',
    templateUrl: './cache.component.html',
    styleUrls: ['./cache.component.scss']
})
export class CacheComponent implements OnInit {
    private readonly service = inject(SystemService);
    private readonly toastrService = inject(DialogService);


    public items: IItem[] = [];

    constructor() {
        this.service.cacheStore().subscribe(res => {
            this.items = res;
        });
    }

    ngOnInit() {
    }


    public tapSubmit(e?: ButtonEvent) {
        const store: string[] = [];
        for (const item of this.items) {
            if (item.checked) {
                store.push(item.value as string);
            }
        }
        if (store.length < 1) {
            this.toastrService.warning('未选中任何内容');
            return;
        }
        e?.enter();
        this.service.cacheClear({store}).subscribe({
            next: _ => {
                e.reset();
                this.toastrService.success('成功清除缓存');
            },
            error: err => {
                e.reset();
                this.toastrService.error(err);
            }
        });
    }


    public tapClear(e?: ButtonEvent) {
        this.toastrService.confirm('确认清除全部缓存?', () => {
            e?.enter();
            this.service.cacheClear({}).subscribe({
                next: _ => {
                    e.reset();
                    this.toastrService.success('成功清除全部缓存');
                },
                error: err => {
                    e.reset();
                    this.toastrService.error(err);
                }
            });
        });
    }
}
