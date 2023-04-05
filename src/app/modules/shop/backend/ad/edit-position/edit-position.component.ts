import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IAdPosition } from '../../../model';
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
    private toastrService: DialogService,
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
      this.toastrService.warning($localize `Incomplete filling of the form`);
      return;
    }
    const data: IAdPosition = Object.assign({}, this.form.value) as any;
    if (this.data && this.data.id > 0) {
      data.id = this.data.id;
    }
    this.service.positionSave(data).subscribe(_ => {
      this.toastrService.success($localize `Save Successfully`);
      this.tapBack();
    });
  }

}
