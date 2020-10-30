import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IImageUploadEvent } from '../../../theme/components';
import { IBlog, ICategory, ITag } from '../../../theme/models/blog';
import { FileUploadService } from '../../../theme/services/file-upload.service';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  public form = this.fb.group({
    title: ['', Validators.required],
    keywords: [''],
    content: ['', Validators.required],
    description: [''],
    term_id: [0, Validators.required],
    programming_language: [''],
    type: ['0'],
    thumb: [''],
    open_type: ['0'],
    open_rule: [''],
    edit_type: ['1'],
    source_url: [''],
    source_author: [''],
    is_hide: [0],
    weather: [''],
    audio_url: [''],
    video_url: [''],
    cc_license: [''],
    comment_status: [''],
    tags: [[]],
  });

  public data: IBlog;

  public tagItems: ITag[] = [];

  public categories: ICategory[] = [];

  constructor(
    private fb: FormBuilder,
    private service: BlogService,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private uploadService: FileUploadService,
  ) {
    this.service.categoryAll().subscribe(res => {
      this.categories = res;
    });
    this.service.tagAll().subscribe(res => {
      this.tagItems = res;
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!params.id) {
        return;
      }
      this.service.blog(params.id).subscribe(res => {
        this.data = res;
        this.form.setValue({
          title: res.title,
          content: res.content,
          keywords: res.keywords,
          description: res.description,
          term_id: res.term_id,
          programming_language: res.programming_language,
          type: res.type,
          thumb: res.thumb,
          open_type: res.open_type,
          open_rule: res.open_rule,
          edit_type: res.edit_type,
          source_url: res.source_url,
          source_author: res.source_author,
          is_hide: res.is_hide,
          weather: res.weather,
          audio_url: res.audio_url,
          video_url: res.video_url,
          cc_license: res.cc_license,
          comment_status: res.comment_status,
          tags: res.tags,
        });
      });
    });
  }

  public get typeInput() {
    return this.form.get('type');
  }

  public get openType() {
    return this.form.get('open_type');
  }

  public get ruleLabel() {
    const val = parseInt(this.openType.value, 10);
    if (val < 5) {
      return '';
    }
    if (val === 5) {
      return '阅读密码';
    }
    if (val === 6) {
      return '购买价格';
    }
    return '规则';
  }

  public tapBack() {
    history.back();
  }

  public tapSubmit() {
    if (this.form.invalid) {
      this.toastrService.warning('表单填写不完整');
      return;
    }
    const data: IBlog = this.form.value;
    if (this.data && this.data.id > 0) {
      data.id = this.data.id;
    }
    this.service.blogSave(data).subscribe(_ => {
      this.toastrService.success('保存成功');
      this.tapBack();
    });
  }

  public editorImageUpload(event: IImageUploadEvent) {
    this.uploadService.uploadImages(event.files).subscribe(res => {
      for (const item of res) {
        event.target.insertImage(item.url, item.original);
      }
    });
  }

  public uploadFile(event: any) {
    const files = event.target.files as FileList;
    this.uploadService.uploadImage(files[0]).subscribe(res => {
      this.form.get('thumb').setValue(res.url);
    });
  }

  public tapPreview() {
    window.open(this.form.get('thumb').value, '_blank');
  }

  public uploadAudio(event: any) {
    const files = event.target.files as FileList;
    this.uploadService.uploadAudio(files[0]).subscribe(res => {
      this.form.get('audio_url').setValue(res.url);
    });
  }

  public uploadVideo(event: any) {
    const files = event.target.files as FileList;
    this.uploadService.uploadVideo(files[0]).subscribe(res => {
      this.form.get('video_url').setValue(res.url);
    });
  }

}
