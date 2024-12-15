import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IForum, IForumClassify } from '../../model';
import { IUser } from '../../../../theme/models/user';
import { filterTree } from '../../../../theme/utils';
import { emptyValidate } from '../../../../theme/validators';
import { ForumService } from '../forum.service';
import { DialogBoxComponent, DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        thumb: [''],
        parent_id: [0],
        description: [''],
        type: [0],
        position: [99],
    });

    public data: IForum;
    public categories: IForum[] = [];
    public classifyItems: IForumClassify[] = [];
    public userItems: IUser[] = [];
    public editData: IForumClassify = {
        id: 0,
        name: '',
        icon: '',
    };
    public userKeywords = '';
    public users: IUser[] = [];

    constructor(
        private fb: FormBuilder,
        private service: ForumService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {
        this.service.forumAll().subscribe(res => {
            this.categories = res.data;
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params.parent) {
                this.form.get('parent_id').setValue(parseInt(params.parent, 10));
            }
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
              return;
            }
            this.service.forum(params.id).subscribe(res => {
                this.data = res;
                this.categories = filterTree(this.categories, res.id);
                if (res.classifies) {
                    this.classifyItems = res.classifies;
                }
                if (res.moderators) {
                    this.userItems = res.moderators;
                }
                this.form.patchValue({
                    name: res.name,
                    parent_id: res.parent_id,
                    thumb: res.thumb,
                    description: res.description,
                    type: res.type,
                    position: res.position,
                });
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IForum = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        data.classifies = this.classifyItems;
        data.moderators = this.userItems;
        e?.enter();
        this.service.forumSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
                this.tapBack();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

    public editClassify(modal: DialogBoxComponent, item?: IForumClassify) {
        this.editData = item ? {...item} : {
            id: 0,
            name: '',
            icon: '',
        };
        modal.open(() => {
            if (!item) {
                this.classifyItems.push(this.editData);
            } else {
                item.icon = this.editData.icon;
                item.name = this.editData.name;
            }
        }, () => {
            return !emptyValidate(this.editData.name) || !emptyValidate(this.editData.icon)
        }, item ? '编辑主题' : '新增主题');
    }

    public removeClassify(item: IForumClassify) {
        this.classifyItems = this.classifyItems.filter(res => res.name !== item.name || res.icon !== item.icon);
    }

    public tapSearchUser() {
        this.service.userList({
            keywords: this.userKeywords
        }).subscribe(res => {
            this.users = res.data;
        });
    }

    public addUser(modal: DialogBoxComponent) {
        modal.open(() => {
            for (const user of this.users) {
                if (!user.checked) {
                    continue;
                }
                let had = false;
                for (const item of this.userItems) {
                    if (item.id === user.id) {
                        had = true;
                    }
                }
                if (!had) {
                    this.userItems.push(user);
                }
            }
        });
    }

    public removeUser(item: IUser) {
        this.userItems = this.userItems.filter(res => res.id !== item.id);
    }

}
