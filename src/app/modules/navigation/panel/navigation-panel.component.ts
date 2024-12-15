import { Component, ViewChild } from '@angular/core';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { emptyValidate } from '../../../theme/validators';
import { ISiteCollect, ISiteCollectGroup } from '../model';
import { NavigationService } from '../navigation.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../theme/interfaces';
import { selectAuthStatus } from '../../../theme/reducers/auth.selectors';
import { parseNumber } from '../../../theme/utils';

const NavSaveKey = 'nsk';
const NavSaveModekey = 'nsmk';

@Component({
    standalone: false,
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
    public isGuest = true;
    private saveMode = 0;
    private isUpdated = false;

    constructor(
        private service: NavigationService,
        private toastrService: DialogService,
        private store: Store<AppState>,
    ) {
        const mode = parseNumber(window.localStorage.getItem(NavSaveModekey));
        this.store.select(selectAuthStatus).subscribe(res => {
            if (!res.isLoading) {
                this.loadAsync(res.guest);
            }
        });
        if (mode === 1) {
            this.loadAsync(mode);
        }
    }

    public get isSaveCloud() {
        return this.saveMode === 2;
    }

    private loadAsync(mode: number);
    private loadAsync(isGuest: boolean);
    private loadAsync(isGuest: boolean|number) {
        this.isUpdated = false;
        let mode = 0;
        if (typeof isGuest === 'boolean') {
            this.isGuest = isGuest;
            mode = parseNumber(window.localStorage.getItem(NavSaveModekey));
        } else {
            mode = isGuest;
        }
        if (mode < 1 && !this.isGuest) {
            mode = 2;
        }
        if (mode === this.saveMode) {
            return;
        }
        if (mode === 2) {
            if (this.isGuest) {
                return;
            }
            this.saveMode = mode;
            this.service.collectAll().subscribe(res => {
                this.items = res.data;
            });
            return;
        }
        this.saveMode = mode;
        const data = window.localStorage.getItem(NavSaveKey);
        if (!data) {
            return;
        }
        this.items = JSON.parse(data);
    }

    public collect(name: string, link: string) {
        if (this.isExist(link, 0)) {
            return;
        }
        if (this.items.length < 1) {
            this.items.push({
                id: this.generateId(false),
                name: $localize `Default`,
                items: []
            });
        }
        const group = this.items[0];
        group.items.push({
            id: this.generateId(true),
            name,
            link,
            group_id: group.id, 
        });
        this.tapSave(0);
    }

    public toggleEdit(toggle?:boolean) {
        if (typeof toggle === 'undefined') {
            toggle = !this.editMode;
        }
        if (!this.isUpdated || toggle) {
            this.editMode = toggle;
            return;
        }
        this.toastrService.confirm($localize `You haven't saved and confirmed to leave?`, () => {
            this.editMode = toggle;
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

    public tapReset() {
        this.toastrService.confirm($localize `Are you sure to reset?`, () => {
            window.localStorage.removeItem(NavSaveModekey);
            this.loadAsync(this.isGuest);
        });
    }

    public tapSave(mode: number) {
        if (mode < 1) {
            mode = this.saveMode;
        }
        this.saveMode = mode;
        this.isUpdated = false;
        if (mode !== 2) {
            this.saveAsync();
            return;
        }
        this.service.collectBatchSave(this.items).subscribe({
            next: res => {
                this.items = res.data;
                this.saveAsync();
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    private saveAsync() {
        window.localStorage.setItem(NavSaveModekey, this.saveMode.toString());
        window.localStorage.setItem(NavSaveKey, JSON.stringify(this.items));
        this.toastrService.success($localize `Save collection successfully`);
    }

    public tapRemove(i: number, j = -1) {
        const item = j < 0 ? this.items[i] : this.items[i].items[j];
        this.toastrService.confirm($localize `Are you sure to delete"${item.name}"` + (j < 0 ? $localize `Group` : $localize `Link`), () => {
            if (j < 0) {
                this.items.splice(i, 1);
                return;
            }
            this.items[i].items.splice(j, 1);
            // if (j < 0) {
            //     this.service.groupRemove(item.id).subscribe(() => {
            //         this.items.splice(i, 1);
            //     });
            //     return;
            // }
            // this.service.collectRemove(item.id).subscribe(() => {
            //     this.items[i].items.splice(j, 1);
            // });
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
            if (this.editData.group_id > 0) {
                if (emptyValidate(this.editData.link)) {
                    this.toastrService.error($localize `Please input the Link`);
                    return;
                }
                if (this.isExist(this.editData.link, this.editData.id)) {
                    this.toastrService.error($localize `This Link is exist`);
                    return;
                }
            }
            if (!this.editData.id)  {
                this.editData.id = this.generateId(this.editData.group_id > 0);
            }
            this.isUpdated = true;
            cb({...this.editData} as any);
            // const pipe: Observable<any> = this.editData.group_id > 0 ? this.service.collectSave(this.editData) : this.service.groupSave(this.editData);
            // pipe.subscribe({
            //     next: res => {
            //         cb(res);
            //     },
            //     error: err => {
            //         this.toastrService.error(err);
            //     }
            // });
        }, () => !emptyValidate(this.editData.name), (item ? $localize `Edit` : $localize `New`));
    }

    private generateId(isLink: boolean): number {
        let max = 0;
        for (const group of this.items) {
            if (!isLink) {
                if (max < group.id) {
                    max = group.id;
                }
                continue;
            }
            for (const item of group.items) {
                if (item.id < max) {
                    continue;
                }
                max = item.id;
            }
        }
        return max + 1;
    }

    private isExist(link: string, id: number) {
        for (const group of this.items) {
            for (const item of group.items) {
                if (item.id !== id && link === item.link) {
                    return true;
                }
            }
        }
        return false;
    }
}
