import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { ICmsSite, ICMSTheme } from '../../../model';
import { CmsService } from '../../cms.service';
import { IItem } from '../../../../../theme/models/seo';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-edit-site',
    templateUrl: './edit-site.component.html',
    styleUrls: ['./edit-site.component.scss']
})
export class EditSiteComponent implements OnInit {
    private readonly service = inject(CmsService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        title: '',
        theme: '',
        match_type: '',
        match_rule: '',
        logo: '',
        keywords: '',
        description: '',
        language: '',
        status: '5',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.title);
        required(schemaPath.theme);
    });

    public themeItems: ICMSTheme[] = [];
    public statusItems: IItem[] = [
        {name: '下线', value: 0},
        {name: '上线', value: 5},
    ];

    ngOnInit() {
        this.service.batch({
            theme: {}
        }).subscribe(res => {
            this.themeItems = res.theme;
            if (this.dataModel().id  == 0 && this.themeItems.length > 0) {
                this.dataModel.update(v => {
                    v.theme = this.themeItems[0].name;
                    return v;
                });
            }
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.site(params.id).subscribe(res => {
                this.dataModel.set({
                    id: res.id,
                    title: res.title,
                    theme: res.theme,
                    match_type: res.match_type as any,
                    match_rule: res.match_rule,
                    logo: res.logo,
                    keywords: res.keywords,
                    description: res.description,
                    status: res.status as any,
                    language: res.language
                });
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: ICmsSite = this.dataForm().value() as any;
        this.service.siteSave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }
}
