import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { SearchService } from '../../../../../theme/services';
import { eachObject } from '../../../../../theme/utils';
import { ICmsContent, ICmsFormGroup } from '../../../model';
import { CmsService } from '../../cms.service';
import { form } from '@angular/forms/signals';
import { ButtonEvent } from '../../../../../components/form';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    standalone: false,
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class FormDetailComponent implements OnInit {
    private readonly service = inject(CmsService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);


    public data: ICmsContent;
    public readonly queries = form(signal({
        model: 0,
        parent: 0,
        site: 0,
        category: 0,
        id: 0,
    }));
    public readonly formItems = signal<ICmsFormGroup[]>([]);
    public readonly tabIndex = signal(0);
    public readonly form = computed(() => {
        const items = this.formItems();
        const groups: any = {};
        for (const group of items) {
            for (const item of group.items) {
                groups[item.name] = new FormControl(item.value || '');
            }
        }
        return new FormGroup(groups);
    });

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.service.content(this.queries).subscribe(res => {
                this.data = res;
                this.formItems.set(res.form_data);
            });
        });
    }

    public tapTab(index: number) {
        this.tabIndex.set(index);
    }


    public tapSubmit2(e: SubmitEvent) {
        e.preventDefault();
        this.tapSubmit();
    }

    public tapSubmit(e?: ButtonEvent) {
        const data: any = this.form().getRawValue();
        eachObject(this.queries().value(), (v, k) => {
            if (k === 'id') {
                return;
            }
            data[(k === 'category' ? 'cat' : k) + '_id'] = v;
        });
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        e?.enter();
        this.service.contentSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
                history.back();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

}
