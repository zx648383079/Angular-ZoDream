import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IAd, IAdPosition } from '../../../../theme/models/shop';
import { AdService } from '../../ad.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditAdComponent implements OnInit {

  public form = this.fb.group({
    title: ['', Validators.required],
    position_id: ['0'],
    type: ['0'],
    url: [''],
    content: [''],
    start_at: [''],
    end_at: [''],
  });

  public data: IAd;
  public positionItems: IAdPosition[] = [];

  constructor(
    private service: AdService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
  ) {
    this.service.positionAll().subscribe(res => {
      this.positionItems = res.data;
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!params.id) {
        return;
      }
      this.service.ad(params.id).subscribe(res => {
        this.data = res;
        this.form.setValue({
          name: res.name,
          position_id: res.position_id,
          type: res.type,
          url: res.url,
          content: res.content,
          start_at: res.start_at,
          end_at: res.start_at,
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
    const data: IAd = this.form.value;
    if (this.data && this.data.id > 0) {
      data.id = this.data.id;
    }
    this.service.adSave(data).subscribe(_ => {
      this.toastrService.success('保存成功');
      this.tapBack();
    });
  }

  public uploadFile(event: any) {

  }

}
