import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'zo-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

    public tabItems = [
        '基本',
        '图片',
        '详情',
        '其他',
        '属性'
    ];

    public tabIndex = 0;

    public goodsForm: FormGroup;

    constructor(
        private fb: FormBuilder
    ) {
        this.goodsForm = this.fb.group({
            name: ['', Validators.required]
        });
    }

    ngOnInit() {
    }

    public onSubmit() {
        if (this.goodsForm.valid) {
            
        }
        
        console.log(this.goodsForm.errors, this.goodsForm.value, arguments);
    }

}
