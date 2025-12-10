import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../user.service';
import { ThemeService } from '../../../theme/services';
import { IUserZone } from '../../../theme/models/user';
import { ButtonEvent } from '../../../components/form';
import { DialogService } from '../../../components/dialog';

@Component({
    standalone: false,
    selector: 'app-member-zone-selector',
    templateUrl: './zone.component.html',
    styleUrls: ['./zone.component.scss']
})
export class ZoneComponent implements OnInit {
    private themeService = inject(ThemeService);
    private toastrService = inject(DialogService);
    private service = inject(UserService);



    public selectedItems: IUserZone[] = [];
    public items: IUserZone[] = [];
    public activatedAt = 0;

    constructor() {
        this.themeService.titleChanged.next($localize `Zone Selection`);
    }

    ngOnInit(): void {
        this.service.zoneList().subscribe(res => {
            this.items = res.data;
            this.selectedItems = res.selected;
            this.activatedAt = res.activated_at;
        });
    }

    public tapBack() {
        history.back();
    }

    public isSelected(item: IUserZone) {
        for (const it of this.selectedItems) {
            if (it.id === item.id) {
                return true;
            }
        }
        return false;
    }

    public tapSelect(item: IUserZone) {
        if (this.activatedAt > 0) {
            return;
        }
        this.selectedItems = [item];
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.selectedItems.length === 0 || this.activatedAt > 0) {
            return;
        }
        e?.enter();
        this.service.zoneSave({
            id: this.selectedItems.map(i => i.id)
        }).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        })
    }
}
