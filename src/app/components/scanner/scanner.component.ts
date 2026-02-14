import { Component, DestroyRef, ElementRef, afterNextRender, inject, output, viewChild } from '@angular/core';
import { BarcodeFormat, BrowserCodeReader, BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { DecodeHintType } from '@zxing/library';

@Component({
    standalone: false,
    selector: 'app-scanner',
    templateUrl: './scanner.component.html',
    styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent {
    private readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);
    private readonly destroyRef = inject(DestroyRef);

    private readonly drawPanel = viewChild<ElementRef<HTMLVideoElement>>('drawer');
    public readonly completed = output<string>();
    private reader: BrowserQRCodeReader;
    private controlItems: IScannerControls;

    constructor() {
        afterNextRender({
            write: () => {
                const bound = this.elementRef.nativeElement.getBoundingClientRect();
                const mediaBox = this.drawPanel().nativeElement;
                mediaBox.width = bound.width <= 0 ? window.innerWidth : bound.width;
                mediaBox.height = bound.height <= 0 ? window.innerHeight : bound.height;
                this.start();
            }
        });
        this.destroyRef.onDestroy(() => this.stop());
    }

    public async start() {
        this.stop();
        if (!this.reader) {
            const hints = new Map();
            const formats = [BarcodeFormat.QR_CODE];
            hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
            this.reader = new BrowserQRCodeReader(hints);
        }
        const videoInputDevices = await BrowserCodeReader.listVideoInputDevices();
        const selectedDeviceId = videoInputDevices[0].deviceId;
        this.controlItems = await this.reader.decodeFromVideoDevice(selectedDeviceId, this.drawPanel().nativeElement, res => {
            if (res) {
                this.stop();
                this.completed.emit(res.getText());
            }
        });
    }

    public stop() {
        if (!this.controlItems) {
            return;
        }
        this.controlItems.stop();
        this.controlItems = undefined;
    }
}
