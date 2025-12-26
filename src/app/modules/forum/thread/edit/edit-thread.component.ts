import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IForum, IThread } from '../../model';
import { IErrorResult } from '../../../../theme/models/page';
import { ForumService } from '../../forum.service';
import { ButtonEvent } from '../../../../components/form';
import { form, required } from '@angular/forms/signals';

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
        id: 0,
        title: '',
        classify_id: '0',
        content: '',
        is_private_post: 0,
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.title);
        required(schemaPath.content);
    });
    public readonly data = signal<IThread>(null);
    public readonly forum = signal<IForum>(null);

    ngOnInit() {
        this.route.params.subscribe(params => {
            const forum_id = parseInt(params.forum, 10);
            this.service.getForum(forum_id, false).subscribe(res => {
                this.forum.set(res);
            });
            if (!params.id) {
                return;
            }
            this.service.threadEdit(params.id).subscribe(res => {
                this.data.set(res);
                this.dataModel.set({
                    id: res.id,
                    title: res.title,
                    classify_id: res.classify_id as any,
                    content: res.content,
                    is_private_post: res.is_private_post,
                });
            });
        });
    }

    public tapSubmit2(e: SubmitEvent) {
        e.preventDefault();
        this.tapSubmit();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `The content is not filled out completely`);
            return;
        }
        const data: any = {...this.dataForm().value(), forum: this.data().forum_id};
        if (this.data().id) {
            data.id = this.data().id;
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
