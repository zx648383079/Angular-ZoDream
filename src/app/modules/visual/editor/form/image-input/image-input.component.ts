import { Component, inject, input, model } from '@angular/core';
import { FileUploadService } from '../../../../../theme/services';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-editor-image-input',
    templateUrl: './image-input.component.html',
    styleUrls: ['./image-input.component.scss'],
    host: {
        class: 'control-line-group',
    },
})
export class EditorImageInputComponent implements FormValueControl<string> {
    private readonly uploadService = inject(FileUploadService);


    public readonly header = input<string>('');
    public readonly multiple = input(false);

    public fileName = this.uploadService.uniqueGuid();
    public isEmpty = true;
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');

    public tapEmpty() {

    }

    public uploadFile(e: any) {
        
    }
    
}
