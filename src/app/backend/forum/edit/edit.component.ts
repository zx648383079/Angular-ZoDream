import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IForum, IForumClassify } from '../../../theme/models/forum';
import { IUser } from '../../../theme/models/user';
import { FileUploadService } from '../../../theme/services/file-upload.service';
import { filterTree } from '../../../theme/utils';
import { ForumService } from '../forum.service';

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
    public editData: IForumClassify;
    public userKeywords = '';
    public users: IUser[] = [];

    constructor(
        private fb: FormBuilder,
        private service: ForumService,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
        private uploadService: FileUploadService,
        private modalService: NgbModal,
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
                this.form.setValue({
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

    public uploadFile(event: any, name: string = 'thumb') {
        const files = event.target.files as FileList;
        this.uploadService.uploadImage(files[0]).subscribe(res => {
            if (name === 'classify') {
                this.editData.icon = res.url;
                return;
            }
            this.form.get(name).setValue(res.url);
        });
    }

    public tapPreview(name: string) {
        window.open(name === 'classify' ? this.editData.icon : this.form.get(name).value, '_blank');
    }

    public editClassify(modal: any, item?: IForumClassify) {
        this.editData = item || {
            id: 0,
            name: '',
            icon: '',
        };
        this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then(value => {
            if (!this.editData.name && !this.editData.icon) {
                return;
            }
            if (!item) {
                this.classifyItems.push(this.editData);
            }
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

    public addUser(modal: any) {
        this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then(value => {
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
