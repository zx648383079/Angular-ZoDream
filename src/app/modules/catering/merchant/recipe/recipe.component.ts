import { Component, OnInit, inject, viewChild } from '@angular/core';
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
    private service = inject(CateringService);
    private toastrService = inject(DialogService);
    private route = inject(ActivatedRoute);
    private searchService = inject(SearchService);


    public readonly modal = viewChild(RecipeDialogComponent);
    private readonly customModal = viewChild(CustomDialogComponent);

    public items: ICateringRecipe[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20
    };
    public categoryItems: ICateringCategory[] = [];

    ngOnInit() {
        this.service.merchantRecipeCategory().subscribe(res => {
            this.categoryItems = res.data;
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapEdit() {
        this.modal().open();
    }


    public tapEditCategory(item?: ICateringCategory) {
        customModal.value = item ? item.name : '';
        customModal.open(value => {
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

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.merchantRecipeList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
