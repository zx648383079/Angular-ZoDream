import { Component, OnInit, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent, DialogService } from '../../../components/dialog';
import { ButtonEvent } from '../../../components/form';
import { IItem } from '../../../theme/models/seo';
import { emptyValidate } from '../../../theme/validators';
import { GenerateService } from '../generate.service';
import { IPreviewFile } from '../model';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-module',
    templateUrl: './module.component.html',
    styleUrls: ['./module.component.scss']
})
export class ModuleComponent implements OnInit {
    private readonly service = inject(GenerateService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly modal = viewChild(DialogBoxComponent);
    public readonly tabIndex = signal(0);
    public moduleItems: IItem[] = [];
    public tableItems: IItem[] = [];
    public readonly installForm = form(signal({
        name: '',
        module: '',
        hasTable: true,
        hasSeed: false,
        hasAssets: false,
    }));
    public readonly generateForm = form(signal({
        module: '',
        table: [],
    }));
    public readonly routeForm = form(signal({
        name: '',
    }));
    public previewItems: IPreviewFile[] = [];
    public routeItems: IItem[] = [];

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
        this.tabIndex.set(i);
    }

    public tapInstall(e: ButtonEvent) {
        e.enter();
        this.service.moduleInstall({...this.installForm().value()}).subscribe({
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
            name: this.routeForm.name().value(),
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
        this.service.module({...this.generateForm().value(),
            preview,
        }).subscribe({
            next: res => {
                this.previewItems = res.data;
                this.modal().open();
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public onModuleChange() {
        if (!emptyValidate(this.installForm.name().value())) {
            return;
        }
        const module = this.installForm.module().value()
        for (const item of this.moduleItems) {
            if (item.value === module) {
                this.installForm.name().value.set(item.name.toLowerCase());
                return;
            }
        }
    }

}
