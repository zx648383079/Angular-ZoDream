import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IAdPosition } from '../../../../theme/models/shop';
import { AdService } from '../../ad.service';

@Component({
  selector: 'app-edit-position',
  templateUrl: './edit-position.component.html',
  styleUrls: ['./edit-position.component.scss']
})
export class EditPositionComponent implements OnInit {

  public form = this.fb.group({
    name: ['', Validators.required],
    width: ['100%'],
    height: ['100%'],
    template: [''],
  });

  public data: IAdPosition;

  constructor(
    private service: AdService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!params.id) {
        return;
      }
      this.service.position(params.id).subscribe(res => {
        this.data = res;
        this.form.patchValue({
          name: res.name,
          width: res.width,
          height: res.height,
          template: res.template,
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
    const data: IAdPosition = Object.assign({}, this.form.value);
    if (this.data && this.data.id > 0) {
      data.id = this.data.id;
    }
    this.service.positionSave(data).subscribe(_ => {
      this.toastrService.success('保存成功');
      this.tapBack();
    });
  }

}
