import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IArticle, IArticleCategory } from '../../../../theme/models/shop';
import { ArticleService } from '../../article.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditArticleComponent implements OnInit {

  public form = this.fb.group({
    title: ['', Validators.required],
    cat_id: ['0'],
    thumb: [''],
    keywords: [''],
    description: [''],
    content: ['']
  });

  public data: IArticle;
  public categories: IArticleCategory[] = [];

  constructor(
    private service: ArticleService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
  ) {
    this.service.categoryTree().subscribe(res => {
      this.categories = res.data;
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!params.id) {
        return;
      }
      this.service.article(params.id).subscribe(res => {
        this.data = res;
        this.form.setValue({
          title: res.title,
          cat_id: res.cat_id,
          thumb: res.thumb,
          keywords: '',
          description: res.description
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
    const data: IArticle = this.form.value;
    if (this.data && this.data.id > 0) {
      data.id = this.data.id;
    }
    this.service.articleSave(data).subscribe(_ => {
      this.toastrService.success('保存成功');
      this.tapBack();
    });
  }

  public uploadFile(event: any) {

  }

}
