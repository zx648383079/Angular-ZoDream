import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../dialog';
import { ICategory } from '../../../../theme/models/blog';
import { FileUploadService } from '../../../../theme/services/file-upload.service';
import { BlogService } from '../../blog.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {

  public form = this.fb.group({
    name: ['', Validators.required],
    thumb: [''],
    keywords: [''],
    description: [''],
    styles: [''],
  });

  public data: ICategory;

  constructor(
    private fb: FormBuilder,
    private service: BlogService,
    private route: ActivatedRoute,
    private toastrService: DialogService,
    private uploadService: FileUploadService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!params.id) {
        return;
      }
      this.service.category(params.id).subscribe(res => {
        this.data = res;
        this.form.patchValue({
          name: res.name,
          thumb: res.thumb,
          keywords: res.keywords,
          description: res.description,
          styles: res.styles,
        });
      });
    });
  }

  get name() {
    return this.form.get('name');
  }

  public tapBack() {
    history.back();
  }

  public tapSubmit() {
    if (this.form.invalid) {
      this.toastrService.warning('表单填写不完整');
      return;
    }
    const data: ICategory = Object.assign({}, this.form.value);
    if (this.data && this.data.id > 0) {
      data.id = this.data.id;
    }
    this.service.categorySave(data).subscribe(_ => {
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

  public tapPreview() {
    window.open(this.form.get('thumb').value, '_blank');
  }
}
