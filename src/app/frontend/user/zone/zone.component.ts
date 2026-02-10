import { Component, OnInit, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
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
    private readonly themeService = inject(ThemeService);
    private readonly toastrService = inject(DialogService);
    private readonly service = inject(UserService);
    private readonly location = inject(Location);


    public readonly selectedItems = signal<IUserZone[]>([]);
    public readonly items = signal<IUserZone[]>([]);
    public readonly activatedAt = signal(0);

    constructor() {
        this.themeService.titleChanged.next($localize `Zone Selection`);
    }

    ngOnInit(): void {
        this.service.zoneList().subscribe(res => {
            this.items.set(res.data);
            this.selectedItems.set(res.selected);
            this.activatedAt.set(res.activated_at);
        });
    }

    public tapBack() {
        this.location.back();
    }

    public isSelected(item: IUserZone) {
        for (const it of this.selectedItems()) {
            if (it.id === item.id) {
                return true;
            }
        }
        return false;
    }

    public tapSelect(item: IUserZone) {
        if (this.activatedAt() > 0) {
            return;
        }
        this.selectedItems.set([item]);
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.selectedItems().length === 0 || this.activatedAt() > 0) {
            return;
        }
        e?.enter();
        this.service.zoneSave({
            id: this.selectedItems().map(i => i.id)
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
