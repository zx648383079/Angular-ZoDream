import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DialogBoxComponent } from '../../../../theme/components';
import { IBlackWord } from '../../../../theme/models/forum';
import { emptyValidate } from '../../../../theme/validators';
import { ForumService } from '../../forum.service';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent {

    public items: IBlackWord[] = [];

    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public keywords = '';
    public editData: IBlackWord = {} as any;

    constructor(
      private service: ForumService,
      private toastrService: ToastrService,
    ) {
        this.tapRefresh();
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
      this.goPage(1);
    }

    public tapPage() {
      this.goPage(this.page);
    }

    public tapMore() {
      this.goPage(this.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
      if (this.isLoading) {
          return;
      }
      this.isLoading = true;
      this.service.wordList({
        keywords: this.keywords,
        page,
        per_page: this.perPage
      }).subscribe(res => {
          this.isLoading = false;
          this.items = res.data;
          this.hasMore = res.paging.more;
          this.total = res.paging.total;
      });
    }

    public tapSearch(form: any) {
      this.keywords = form.keywords;
      this.tapRefresh();
    }

    public tapRemove(item: IBlackWord) {
      if (!confirm('确定删除“' + item.words + '”屏蔽词？')) {
        return;
      }
      this.service.wordRemove(item.id).subscribe(res => {
        if (!res.data) {
          return;
        }
        this.toastrService.success('删除成功');
        this.items = this.items.filter(it => {
          return it.id !== item.id;
        });
      });
    }

    open(modal: DialogBoxComponent, item?: IBlackWord) {
      this.editData = item ? {...item} : {id: 0, words: '', replace_words: ''};
      modal.open(() => {
        this.service.wordSave(Object.assign({}, this.editData)).subscribe(res => {
            this.toastrService.success('保存成功');
            this.tapPage();
          });
      }, () => !emptyValidate(this.editData.words));
    }

}
