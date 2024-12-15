import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent, DialogService } from '../../../components/dialog';
import { ButtonEvent } from '../../../components/form';
import { IItem } from '../../../theme/models/seo';
import { emptyValidate } from '../../../theme/validators';
import { GenerateService } from '../generate.service';
import { IPreviewFile } from '../model';

@Component({
    standalone: false,
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent implements OnInit {

    @ViewChild(DialogBoxComponent)
    public modal: DialogBoxComponent;
    public tabIndex = 0;
    public moduleItems: IItem[] = [];
    public tableItems: IItem[] = [];
    public name = '';
    public installData = {
        name: '',
        module: '',
        hasTable: true,
        hasSeed: false,
        hasAssets: false,
    };
    public generateData = {
        module: '',
        table: [],
    };
    public previewItems: IPreviewFile[] = [];
    public routeItems: IItem[] = [];

    constructor(
        private service: GenerateService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.tapTab(parseInt(params.type, 10) || 0);
        });
        this.service.batch({
            modules: {},
            tables: {},
            routes: {},
        }).subscribe(res => {
            this.moduleItems = res.modules.data;
            this.routeItems = res.routes.data;
            this.tableItems = res.tables.data.map(i => {
                return {
                    name: i,
                    value: i
                };
            });
        });
    }

    public tapTab(i: number) {
        this.tabIndex = i;
    }

    public tapInstall(e: ButtonEvent) {
        e.enter();
        this.service.moduleInstall({...this.installData}).subscribe({
            next: _ => {
                e.reset();
                this.toastrService.success('安装成功');
            },
            error: err => {
                e.reset();
                this.toastrService.error(err);
            }
        });
    }

    public tapUninstall() {
        this.service.moduleUninstall({
            name: this.name,
        }).subscribe({
            next: _ => {
                this.toastrService.success('卸载完成');
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapGenerate(preview = true) {
        this.service.module({...this.generateData,
            preview,
        }).subscribe({
            next: res => {
                this.previewItems = res.data;
                this.modal.open();
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public onModuleChange(module: string) {
        if (!emptyValidate(this.installData.name)) {
            return;
        }
        for (const item of this.moduleItems) {
            if (item.value === module) {
                this.installData.name = item.name.toLowerCase();
                return;
            }
        }
    }

}
