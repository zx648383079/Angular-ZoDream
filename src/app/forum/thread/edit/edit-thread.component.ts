import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../dialog';
import { IForum, IThread } from '../../model';
import { IErrorResult } from '../../../theme/models/page';
import { ForumService } from '../../forum.service';

@Component({
  selector: 'app-edit-thread',
  templateUrl: './edit-thread.component.html',
  styleUrls: ['./edit-thread.component.scss']
})
export class EditThreadComponent implements OnInit {

    public form = this.fb.group({
        title: ['', Validators.required],
        classify_id: [0],
        content: ['', Validators.required], 
        is_private_post: [0],
    });
    public data: IThread = {} as any;
    public forum: IForum;

    constructor(
        private fb: FormBuilder,
        private service: ForumService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.data.forum_id = parseInt(params.forum, 10);
            this.service.getForum(this.data.forum_id, false).subscribe(res => {
                this.forum = res;
            });
            if (!params.id) {
                return;
            }
            this.service.threadEdit(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    title: res.title,
                    classify_id: res.classify_id,
                    content: res.content,
                    is_private_post: res.is_private_post,
                });
            });
        });
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('内容没填写完整');
            return;
        }
        const data = {...this.form.value, forum_id: this.data.forum_id};
        if (this.data.id) {
            data.id = this.data.id;
        }
        this.service.threadSave(data).subscribe(res => {
            this.toastrService.success('发表成功');
            history.back();
        }, (err: IErrorResult) => {
            this.toastrService.warning(err.error.message);
        });
    }
}
