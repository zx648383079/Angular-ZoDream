import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IBlog, ICategory, ITag } from '../../../theme/models/blog';
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
    edit_type: ['0'],
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
  ) {
    this.service.categoryAll().subscribe(res => {
      this.categories = res;
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
    this.service.categorySave(data).subscribe(_ => {
      this.toastrService.success('保存成功');
      this.tapBack();
    });
  }

  public uploadFile(event: any) {

  }

  public uploadAudio(event: any) {

  }

  public uploadVideo(event: any) {

  }

}
