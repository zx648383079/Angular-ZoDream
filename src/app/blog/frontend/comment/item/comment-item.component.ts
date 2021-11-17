import { Component, Input } from '@angular/core';
import { DialogService } from '../../../../dialog';
import { ButtonEvent } from '../../../../form';
import { IComment } from '../../../../theme/models/blog';
import { IUser } from '../../../../theme/models/user';
import { emptyValidate } from '../../../../theme/validators';
import { BlogService } from '../../blog.service';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent {

    @Input() public value: IComment;
    @Input() public user: IUser;

    public expanded = false;
    public editData = {
        name: '',
        email: '',
        url: '',
        content: '',
        parent_id: 0,
        blog_id: 0,
    };

    constructor(
        private service: BlogService,
        private toastrService: DialogService,) { }

    public toggleExpand() {
        this.expanded = !this.expanded;
    }

    public tapComment(e?: ButtonEvent) {
        if (emptyValidate(this.editData.content)) {
            this.toastrService.warning('请输入内容');
            return;
        }
        const data = {...this.editData};
        e?.enter();
        this.service.commentSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success('回复成功！');
                this.editData.content = '';
                this.editData.parent_id = 0;
            }, 
            error: err => {
                e?.reset();
                this.toastrService.warning(err);
            }
        });
    }

    public tapCommenting(item?: IComment) {
        if (item) {
            this.editData.blog_id = item.blog_id;
        }
        this.editData.parent_id = item?.id || 0;
    }

    public tapReport(item: IComment) {
        this.toastrService.confirm('确定举报该评论“' + item.content + '”?', () => {
            this.service.commentReport(item.id).subscribe({
                next: _ => {
                    this.toastrService.success('成功举报该评论，等待审核');
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        });
    }

    public tapAgree(item: IComment) {
        this.service.commentAgree(item.id).subscribe(res => {
            item.agree_count = res.agree_count;
            item.disagree_count = res.disagree_count;
        });
    }

    public tapDisagree(item: IComment) {
        this.service.commentDisagree(item.id).subscribe(res => {
            item.agree_count = res.agree_count;
            item.disagree_count = res.disagree_count;
        });
    }
}
