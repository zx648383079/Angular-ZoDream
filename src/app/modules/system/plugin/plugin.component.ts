import { Component, OnInit, ViewChild } from '@angular/core';
import { IPageEditItem, IPageQueries } from '../../../theme/models/page';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent, DialogEvent, DialogService } from '../../../components/dialog';
import { SearchService } from '../../../theme/services';
import { SystemService } from '../system.service';
import { IPluginItem } from '../../../theme/models/seo';
import { ButtonEvent, FormPanelComponent, FormPanelEvent, IFormInput } from '../../../components/form';

@Component({
    standalone: false,
    selector: 'app-system-plugin',
    templateUrl: './plugin.component.html',
    styleUrls: ['./plugin.component.scss']
})
export class PluginComponent implements OnInit {

    @ViewChild(DialogBoxComponent)
    private modal: DialogEvent;
    @ViewChild(FormPanelComponent)
    private form: FormPanelEvent;
    public isChecked = false;
    public items: IPluginItem[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 120;
    public queries: IPageQueries = {
        page: 1,
        keywords: '',
        per_page: 20,
    };

    constructor(
        private service: SystemService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public get checkedItems() {
        return this.items.filter(i => i.checked);
    }

    public toggleCheck(item?: IPageEditItem) {
        if (!item) {
            this.isChecked = !this.isChecked;
            this.items.forEach(i => {
                i.checked = this.isChecked;
            });
            return;
        }
        item.checked = !item.checked;
        if (!item.checked) {
            this.isChecked = false;
            return;
        }
        if (this.checkedItems.length === this.items.length) {
            this.isChecked = true;
        }
    }

    public tapSync(e?: ButtonEvent) {
        this.toastrService.confirm('确定更新插件？', () => {
            e?.enter();
            this.service.pluginSync().subscribe({
                next: _ => {
                    e?.reset();
                    this.tapRefresh();
                },
                error: err => {
                    e?.reset();
                    this.toastrService.error(err);
                }
            });
        });
    }

    public tapExecute(item: IPluginItem, e?: ButtonEvent) {
        this.toastrService.confirm('确定允许此插件？', () => {
            e?.enter();
            this.service.pluginExecute(item.id).subscribe({
                next: _ => {
                    e?.reset();
                    this.tapRefresh();
                },
                error: err => {
                    e?.reset();
                    this.toastrService.error(err);
                }
            });
        });
    }

    public tapUninstall(item?: IPluginItem) {
        const items = item ? [item.id] : this.checkedItems.map(i => i.id);
        if (items.length < 1) {
            return;
        }
        this.toastrService.confirm(`确定卸载 ${items.length} 个插件？`, () => {
            this.service.pluginUninstall(items).subscribe({
                next: _ => {
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        });
    }

    public tapInstall(item: IPluginItem, data?: any) {
        this.service.pluginInstall(item.id, data).subscribe({
            next: res => {
                if (res.data instanceof Array) {
                    this.renderForm(item, res.data);
                    return;
                }
                this.tapRefresh();
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    private renderForm(item: IPluginItem, items: IFormInput[]) {
        this.form.items = items;
        this.modal.open(() => {
            this.tapInstall(item, this.form.value);
        }, () => this.form.valid, '快速配置');
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
        this.service.pluginList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.isChecked = false;
                this.searchService.applyHistory(this.queries = queries);
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }
}
