import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IForum, IThread } from '../../model';
import { IErrorResult } from '../../../../theme/models/page';
import { ForumService } from '../../forum.service';
import { ButtonEvent } from '../../../../components/form';

@Component({
    standalone: false,
  selector: 'app-edit-thread',
  templateUrl: './edit-thread.component.html',
  styleUrls: ['./edit-thread.component.scss']
})
export class EditThreadComponent implements OnInit {
    private readonly service = inject(ForumService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        title: '',
        classify: 0,
        content: '',
        is_private_post: 0,
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.title);
        required(schemaPath.content);
    });
    public data: IThread = {} as any;
    public forum: IForum;

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
                this.dataModel.set({
                        id: res.id,
                    title: res.title,
                    classify: res.classify_id,
                    content: res.content,
                    is_private_post: res.is_private_post,
                });
            });
        });
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `The content is not filled out completely`);
            return;
        }
        const data: any = {...this.form.value, forum: this.data.forum_id};
        if (this.data.id) {
            data.id = this.data.id;
        }
        e?.enter();
        this.service.threadSave(data).subscribe({
            next: res => {
                e?.reset();
                this.toastrService.success($localize `Published successfully`);
                history.back();
            },
            error: (err: IErrorResult) => {
                e?.reset();
                this.toastrService.warning(err.error.message);
            }
        });
    }
}
