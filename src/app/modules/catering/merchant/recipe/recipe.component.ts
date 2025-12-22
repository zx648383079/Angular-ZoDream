import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, viewChild, signal } from '@angular/core';
import { RecipeDialogComponent } from './dialog/recipe-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { CateringService } from '../../catering.service';
import { ICateringProduct, ICateringCategory, ICateringRecipe } from '../../model';
import { CustomDialogComponent } from '../goods/custom-dialog/custom-dialog.component';

@Component({
    standalone: false,
    selector: 'app-recipe',
    templateUrl: './recipe.component.html',
    styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {
    private readonly service = inject(CateringService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly modal = viewChild(RecipeDialogComponent);
    private readonly customModal = viewChild(CustomDialogComponent);

    public readonly items = signal<ICateringRecipe[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        keywords: '',
        page: 1,
        per_page: 20,
        group: 0
    }));
    public categoryItems: ICateringCategory[] = [];

    ngOnInit() {
        this.service.merchantRecipeCategory().subscribe(res => {
            this.categoryItems = res.data;
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public tapEdit() {
        this.modal().open();
    }


    public tapEditCategory(item?: ICateringCategory) {
        const modal = this.customModal();
        modal.value.set(item ? item.name : '');
        modal.open(value => {
            this.service.merchantRecipeCategorySave({id: item?.id, name: value}).subscribe(res => {
                if (item) {
                    this.categoryItems = this.categoryItems.map(i => {
                        return i.id == res.id ? res : i;
                    });
                } else {
                    this.categoryItems.push(res);
                }
            });
        });
    }

    public tapRemoveCategory(item: ICateringCategory) {
        this.service.merchantRecipeCategoryRemove(item.id).subscribe(_ => {
            this.categoryItems = this.categoryItems.filter(i => i.id !== item.id);
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }


    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.merchantRecipeList(queries).subscribe({
            next: res => {
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
