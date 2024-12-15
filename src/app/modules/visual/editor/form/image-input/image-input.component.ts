import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { FileUploadService } from '../../../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-editor-image-input',
    templateUrl: './image-input.component.html',
    styleUrls: ['./image-input.component.scss'],
    host: {
        class: 'control-line-group',
    },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => EditorImageInputComponent),
        multi: true
    }]
})
export class EditorImageInputComponent implements ControlValueAccessor {

    @Input() public header: string = '';
    @Input() public multiple = false;

    public fileName = this.uploadService.uniqueGuid();
    public isEmpty = true;
    public disabled = false;
    private onChange: any = () => {};
    private onTouch: any = () => {};

    constructor(
        private uploadService: FileUploadService,
    ) {
    }

    public tapEmpty() {

    }

    public uploadFile(e: any) {
        
    }
    
    writeValue(obj: any): void {
        
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
