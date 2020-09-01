import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { IProduct } from '../../../../theme/models/shop';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

    public data: IProduct;

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
