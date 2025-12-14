import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { IPageQueries } from '../../../theme/models/page';
import { ISignature } from '../model';
import { SearchService } from '../../../theme/services';
import { emptyValidate } from '../../../theme/validators';
import { MessageServiceService } from '../ms.service';

@Component({
    standalone: false,
    selector: 'app-ms-signature',
    templateUrl: './signature.component.html',
    styleUrls: ['./signature.component.scss']
})
export class SignatureComponent implements OnInit {
    private readonly service = inject(MessageServiceService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);


    public items: ISignature[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: ''
    }));
    public editData: ISignature = {id: undefined, name: '', sign_no: ''};

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
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

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.signatureList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapRemove(item: ISignature) {
        this.toastrService.confirm('确定删除“' + item.name + '”签名？', () => {
            this.service.signatureRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }

    public tapDefault(item: ISignature) {
        this.service.signatureDefault(item.id).subscribe(_ => {
            this.items = this.items.map(it => {
                it.is_default = item.id === item.id ? 1 : 0;
                return it;
            });
        });
    }

    open(modal: DialogEvent, item?: ISignature) {
        this.editData = item ? {...item} : {id: undefined, name: '', sign_no: ''};
        modal.open(() => {
            this.service.signatureSave({
                name: this.editData.name,
                sign_no: this.editData.sign_no,
                id: this.editData?.id
            }).subscribe({
                next: res => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapPage();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => {
            return !emptyValidate(this.editData.name);
        });
    }

}
