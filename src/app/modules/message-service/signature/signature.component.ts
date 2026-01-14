import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { IPageQueries } from '../../../theme/models/page';
import { ISignature } from '../model';
import { SearchService } from '../../../theme/services';
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


    public readonly items = signal<ISignature[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: ''
    }));
    public readonly editForm = form(signal<ISignature>({
        id: 0, 
        name: '', 
        sign_no: ''
    }), schemaPath => {
        required(schemaPath.name);
    });

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
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
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.signatureList(queries).subscribe({
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

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: ISignature) {
        this.toastrService.confirm('确定删除“' + item.name + '”签名？', () => {
            this.service.signatureRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });
        });
    }

    public tapDefault(item: ISignature) {
        this.service.signatureDefault(item.id).subscribe(_ => {
            this.items.update(v => {
                return v.map(it => {
                    it.is_default = item.id === item.id ? 1 : 0;
                    return it;
                });
            });
        });
    }

    open(modal: DialogEvent, item?: ISignature) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.sign_no = item?.sign_no ?? '';
            return {...v};
        });
        modal.open(() => {
            this.service.signatureSave({
                name: this.editForm.name,
                sign_no: this.editForm.sign_no,
                id: this.editForm?.id
            }).subscribe({
                next: res => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapPage();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => this.editForm().valid());
    }

}
