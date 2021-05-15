import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IForum, IForumClassify } from '../../model';
import { IUser } from '../../../theme/models/user';
import { filterTree } from '../../../theme/utils';
import { emptyValidate } from '../../../theme/validators';
import { ForumService } from '../forum.service';
import { DialogBoxComponent, DialogService } from '../../../dialog';

@Component({
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

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: IForum = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        data.classifies = this.classifyItems;
        data.moderators = this.userItems;
        this.service.forumSave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
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
            }
        }, () => {
            return !emptyValidate(this.editData.name) || !emptyValidate(this.editData.icon)
        });
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
