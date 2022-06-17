import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent, DialogService } from '../../../components/dialog';
import { IPageQueries } from '../../../theme/models/page';
import { ISignature } from '../../../theme/models/sms';
import { applyHistory, getQueries } from '../../../theme/query';
import { emptyValidate } from '../../../theme/validators';
import { SmsService } from '../sms.service';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent implements OnInit {

    public items: ISignature[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: ''
    };
    public editData: ISignature = {id: undefined, name: '', sign_no: ''};

    constructor(
        private service: SmsService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapPage();
        });
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

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.signatureList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                applyHistory(this.queries = queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: ISignature) {
        this.toastrService.confirm('确定删除“' + item.name + '”签名？', () => {
            this.service.signatureRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success('删除成功');
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

    open(modal: DialogBoxComponent, item?: ISignature) {
        this.editData = item ? {...item} : {id: undefined, name: '', sign_no: ''};
        modal.open(() => {
            this.service.signatureSave({
                name: this.editData.name,
                sign_no: this.editData.sign_no,
                id: this.editData?.id
            }).subscribe({
                next: res => {
                    this.toastrService.success('保存成功');
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
