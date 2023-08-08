import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScannerComponent } from './scanner.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [ScannerComponent],
    exports: [ScannerComponent]
})
export class ZreScannerModule { }
