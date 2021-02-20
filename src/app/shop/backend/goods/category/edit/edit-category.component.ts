import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ICategory } from '../../../../../theme/models/shop';
import { FileUploadService } from '../../../../../theme/services/file-upload.service';
import { filterTree } from '../../../../../theme/utils';
import { GoodsService } from '../../goods.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {

  public form = this.fb.group({
    name: ['', Validators.required],
    parent_id: ['0'],
    keywords: [''],
    description: [''],
    icon: [''],
    banner: [''],
    app_banner: [''],
    position: ['99'],
  });

  public data: ICategory;
  public categories: ICategory[] = [];

  constructor(
    private service: GoodsService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private uploadService: FileUploadService,
  ) {
    this.service.categoryAll().subscribe(res => {
      this.categories = res.data;
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!params.id) {
        return;
      }
      this.service.category(params.id).subscribe(res => {
        this.data = res;
        this.categories = filterTree(this.categories, res.id);
        this.form.setValue({
          name: res.name,
          parent_id: res.parent_id,
          keywords: res.keywords,
          description: res.description,
          icon: res.icon,
          banner: res.banner,
          app_banner: res.app_banner,
          position: res.position,
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
    const data: ICategory = Object.assign({}, this.form.value);
    if (this.data && this.data.id > 0) {
      data.id = this.data.id;
    }
    this.service.categorySave(data).subscribe(_ => {
      this.toastrService.success('保存成功');
      this.tapBack();
    });
  }

  public uploadFile(event: any, name: string = 'icon') {
    const files = event.target.files as FileList;
    this.uploadService.uploadImage(files[0]).subscribe(res => {
      this.form.get(name).setValue(res.url);
    });
  }

  public tapPreview(name: string) {
    window.open(this.form.get(name).value, '_blank');
  }

}
