import { form } from '@angular/forms/signals';
import { Component, inject, input, signal } from '@angular/core';
import { ISite, IThemeComponent } from '../../../model';
import { IPageQueries } from '../../../../../theme/models/page';
import { VisualService } from '../../visual.service';
import { SearchService, ThemeService } from '../../../../../theme/services';
import { AppState } from '../../../../../theme/interfaces';
import { Store } from '@ngrx/store';
import { selectAuthStatus } from '../../../../../theme/reducers/auth.selectors';
import { DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-add-dialog',
    templateUrl: './add-dialog.component.html',
    styleUrls: ['./add-dialog.component.scss']
})
export class AddDialogComponent {
    private readonly service = inject(VisualService);
    private readonly searchService = inject(SearchService);
    private readonly themeService = inject(ThemeService);
    private readonly store = inject<Store<AppState>>(Store);
    private readonly toastrService = inject(DialogService);

    public readonly multiple = input(false);
    public readonly visible = signal(false);
    public sourceData: IThemeComponent;
    public readonly items = signal<ISite[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20,
    }));
    public selectedItems: ISite[] = [];
    public onlySelected = false;
    private isGuest = true;

    constructor() {
        this.store.select(selectAuthStatus).subscribe(
            data => {
                this.isGuest = data.guest
            }
        );
    }


    public addTo(item: IThemeComponent) {
        if (this.isGuest) {
            this.themeService.emitLogin(true);
            return;
        }
        this.sourceData = item;
        this.visible.set(true);
    }

    public tapToggleOnly() {
        this.onlySelected = !this.onlySelected;
    }

    public isSelected(item: ISite) {
        for (const i of this.selectedItems) {
            if (i.id === item.id) {
                return true;
            }
        }
        return false;
    }

    public tapSelected(item: ISite) {
        if (!this.multiple()) {
            this.selectedItems = [item];
            return;
        }
        for (let i = 0; i < this.selectedItems.length; i++) {
            if (item.id === this.selectedItems[i].id) {
                this.selectedItems.splice(i, 1);
                return;
            }
        }
        this.selectedItems.push(item);
    }

    public tapYes(e?: ButtonEvent) {
        if (this.selectedItems.length < 1) {
            this.toastrService.warning($localize `Please select any sites`);
            return;
        }
        e?.enter();
        this.service.siteAdd({
            id: this.sourceData.id,
            site: this.selectedItems.map(i => i.id)
        }).subscribe({
            next: _ => {
                e?.reset();
                this.visible.set(false);
                this.toastrService.success($localize `Add Successfully`);
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }


    public tapCancel() {
        this.selectedItems = [];
        this.visible.set(false);
    }

    public get formatItems(): ISite[] {
        return this.onlySelected ? this.selectedItems.map(i => i as ISite) : this.items();
    }


    public get selectedCount() {
        return this.selectedItems.length;
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.mySiteList(queries).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.queries().value.set(queries);
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }
}
