import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IArticle, IArticleCategory } from '../../../../theme/models/shop';
import { FileUploadService } from '../../../../theme/services/file-upload.service';
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
  public tinyConfigs = {
    height: 500,
    base_url: '/tinymce',
    suffix: '.min',
    language_url: '../../../../../assets/tinymce/langs/zh_CN.js',
    language: 'zh_CN',
    plugins: [
      'advlist autolink lists link image imagetools charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount'
    ],
    toolbar:
       'undo redo | formatselect | bold italic backcolor | \
       alignleft aligncenter alignright alignjustify | \
       bullist numlist outdent indent | removeformat | help',
    image_caption: true,
    paste_data_images: true,
    imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
    images_upload_handler: (blobInfo, success: (url: string) => void, failure: (error: string) => void) => {
      const form = new FormData();
      form.append('file', blobInfo.blob(), blobInfo.filename());
      this.uploadService.uploadImages(form).subscribe(res => {
        success(res[0].url);
      }, err => {
        failure(err.error.message);
      });
    },
  };

  constructor(
    private service: ArticleService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private uploadService: FileUploadService,
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
          description: res.description,
          content: res.content
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
    const files = event.target.files as FileList;
    this.uploadService.uploadImage(files[0]).subscribe(res => {
      this.form.get('thumb').setValue(res.url);
    });
  }

}
