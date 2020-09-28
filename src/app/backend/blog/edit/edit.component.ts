import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IBlog, ITag } from '../../../theme/models/blog';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  public form = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    description: [''],
    tags: [[]],
  });

  public data: IBlog;

  public tagItems: ITag[] = [];

  public langItems = ['Html', 'Css', 'Sass', 'Less', 'TypeScript', 'JavaScript', 'PHP', 'Go', 'C#', 'ASP.NET', '.NET Core', 'Python', 'C', 'C++', 'Java', 'Kotlin', 'Swift', 'Objective-C', 'Dart', 'Flutter'];

  constructor(
    private fb: FormBuilder,
    private service: BlogService,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!params.id) {
        return;
      }
      this.service.blog(params.id).subscribe(res => {
        this.data = res;
        this.form.setValue({
          title: res.title,
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
