import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { ICmsSite, ICMSTheme } from '../../../model';
import { CmsService } from '../../cms.service';
import { IItem } from '../../../../../theme/models/seo';

@Component({
  selector: 'app-edit-site',
  templateUrl: './edit-site.component.html',
  styleUrls: ['./edit-site.component.scss']
})
export class EditSiteComponent implements OnInit {

    public form = this.fb.group({
        title: ['', Validators.required],
        theme: ['', Validators.required],
        match_type: 0,
        match_rule: '',
        logo: '',
        keywords: '',
        description: '',
        language: '',
        status: 5,
    });

    public data: ICmsSite;
    public themeItems: ICMSTheme[] = [];
    public statusItems: IItem[] = [
        {name: '下线', value: 0},
        {name: '上线', value: 5},
    ];

    constructor(
        private fb: FormBuilder,
        private service: CmsService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {}

    ngOnInit() {
        this.service.batch({
            theme: {}
        }).subscribe(res => {
            this.themeItems = res.theme;
            if (!this.data && this.themeItems.length > 0) {
                this.form.patchValue({
                    theme: this.themeItems[0].name
                });
            }
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.site(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    title: res.title,
                    theme: res.theme,
                    match_type: res.match_type,
                    match_rule: res.match_rule,
                    logo: res.logo,
                    keywords: res.keywords,
                    description: res.description,
                    status: res.status,
                    language: res.language
                });
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: ICmsSite = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        this.service.siteSave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }
}
