import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DialogEvent, DialogService } from '../../dialog';
import { emptyValidate } from '../../theme/validators';
import { ISiteCollect, ISiteCollectGroup } from '../model';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-navigation-panel',
  templateUrl: './navigation-panel.component.html',
  styleUrls: ['./navigation-panel.component.scss']
})
export class NavigationPanelComponent {

    @ViewChild('modal')
    public modal: DialogEvent;

    public editMode = false;
    public items: ISiteCollectGroup[] = [];
    public editData: ISiteCollect = {} as any;

    constructor(
        private service: NavigationService,
        private toastrService: DialogService,
    ) {
        this.service.collectAll().subscribe(res => {
            this.items = res.data;
        });
    }


    public tapAdd() {
        this.open(undefined, data => {
            if (data.group_id) {
                this.items[this.groupIndex(data.group_id)].items.push(data);
                return;
            }
            data.items = [];
            this.items.push(data);
        });
    }

    public tapEdit(i: number, j = -1) {
        const item = j < 0 ? this.items[i] : this.items[i].items[j];
        this.open(item, data => {
            if (j < 0) {
                this.items[i].name = data.name;
                return;
            }
            this.items[i].items[j] = data as any;
        });
    }

    public tapRemove(i: number, j = -1) {
        const item = j < 0 ? this.items[i] : this.items[i].items[j];
        this.toastrService.confirm('确定删除“' + item.name + '”' + (j < 0 ? '分组' : '网址'), () => {
            if (j < 0) {
                this.service.groupRemove(item.id).subscribe(() => {
                    this.items.splice(i, 1);
                });
                return;
            }
            this.service.collectRemove(item.id).subscribe(() => {
                this.items[i].items.splice(j, 1);
            });
        });
    }

    private groupIndex(id: number): number {
        for (let i = 0; i < this.items.length; i++) {
            const element = this.items[i];
            if (element.id == id) {
                return i;
            }
        }
        return 0;
    }

    private open<T = ISiteCollect>(item: T|undefined, cb: (data: T) => void) {
        this.editData = item ?  {...item} : {} as any;
        if (!this.editData.group_id) {
            this.editData.group_id = 0;
        }
        this.modal.open(() => {
            const pipe: Observable<any> = this.editData.group_id > 0 ? this.service.collectSave(this.editData) : this.service.groupSave(this.editData);
            pipe.subscribe({
                next: res => {
                    cb(res);
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => !emptyValidate(this.editData.name), (item ? '编辑' : '新增'));
    }
}
