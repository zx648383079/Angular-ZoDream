import { Component, inject } from '@angular/core';
import { ISite } from '../../../model';
import { VisualService } from '../../visual.service';
import { ThemeService } from '../../../../../theme/services';
import { AppState } from '../../../../../theme/interfaces';
import { Store } from '@ngrx/store';
import { selectAuthStatus } from '../../../../../theme/reducers/auth.selectors';
import { ButtonEvent } from '../../../../../components/form';
import { DialogService } from '../../../../../components/dialog';
import { emptyValidate } from '../../../../../theme/validators';

@Component({
    standalone: false,
    selector: 'app-clone-dialog',
    templateUrl: './clone-dialog.component.html',
    styleUrls: ['./clone-dialog.component.scss']
})
export class CloneDialogComponent {
    private readonly service = inject(VisualService);
    private readonly themeService = inject(ThemeService);
    private readonly toastrService = inject(DialogService);
    private readonly store = inject<Store<AppState>>(Store);


    public visible = false;
    public sourceData: ISite;
    public editData: ISite = {} as any;
    private isGuest = true;

    constructor() {
        this.store.select(selectAuthStatus).subscribe(
            data => {
                this.isGuest = data.guest
            }
        );
    }


    public cloneTo(item: ISite) {
        if (this.isGuest) {
            this.themeService.emitLogin(true);
            return;
        }
        this.editData = {} as any;
        this.sourceData = item;
        this.visible = true;
    }


    public tapYes(e?: ButtonEvent) {
        if (emptyValidate(this.editData.title) || emptyValidate(this.editData.name)) {
            this.toastrService.warning($localize `Please input site name`);
            return;
        }
        e?.enter();
        this.service.siteClone({
            source: this.sourceData.id,
            ... this.editData
        }).subscribe({
            next: _ => {
                e?.reset();
                this.visible = false;
                this.toastrService.success($localize `Clone Successfully`);
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

    public tapCancel() {

        this.visible = false;
    }
}
