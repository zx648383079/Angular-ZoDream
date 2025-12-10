import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { ITag } from '../../../model';
import { BlogService } from '../../blog.service';

@Component({
    standalone: false,
  selector: 'app-edit-tag',
  templateUrl: './edit-tag.component.html',
  styleUrls: ['./edit-tag.component.scss']
})
export class EditTagComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(BlogService);
  private route = inject(ActivatedRoute);
  private toastrService = inject(DialogService);


  public form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  public data: ITag;

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!params.id) {
        return;
      }
      this.service.tag(params.id).subscribe(res => {
        this.data = res;
        this.form.patchValue({
          name: res.name,
          description: res.description
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
      this.toastrService.warning($localize `Incomplete filling of the form`);
      return;
    }
    const data: ITag = Object.assign({}, this.form.value) as any;
    if (this.data && this.data.id > 0) {
      data.id = this.data.id;
    }
    this.service.tagSave(data).subscribe(_ => {
      this.toastrService.success($localize `Save Successfully`);
      this.tapBack();
    });
  }

}
