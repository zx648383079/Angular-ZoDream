import { Component, OnInit, ViewChild } from '@angular/core';
import { RecipeDialogComponent } from './dialog/recipe-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { CateringService } from '../../catering.service';
import { ICateringProduct, ICateringCategory, ICateringRecipe } from '../../model';
import { CustomDialogComponent } from '../goods/custom-dialog/custom-dialog.component';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {

    @ViewChild(RecipeDialogComponent)
    public modal: RecipeDialogComponent;
    @ViewChild(CustomDialogComponent)
    private customModal: CustomDialogComponent;

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

    constructor(
        private service: CateringService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) { }

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
        this.modal.open();
    }


    public tapEditCategory(item?: ICateringCategory) {
        this.customModal.value = item ? item.name : '';
        this.customModal.open(value => {
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
