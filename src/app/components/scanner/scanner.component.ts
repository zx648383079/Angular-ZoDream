import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { BarcodeFormat, BrowserCodeReader, BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { DecodeHintType } from '@zxing/library';

@Component({
    standalone: false,
    selector: 'app-scanner',
    templateUrl: './scanner.component.html',
    styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('drawer', {static: true})
    private drawPanel: ElementRef<HTMLVideoElement>;
    @Output() public completed = new EventEmitter<string>();
    private reader: BrowserQRCodeReader;
    private controlItems: IScannerControls;

    constructor(
        private elementRef: ElementRef<HTMLDivElement>
    ) { }

    ngOnInit() {

    }

    ngOnDestroy(): void {
        this.stop();
    }

    ngAfterViewInit(): void {
        const bound = this.elementRef.nativeElement.getBoundingClientRect();
        const mediaBox = this.drawPanel.nativeElement;
        mediaBox.width = bound.width <= 0 ? window.innerWidth : bound.width;
        mediaBox.height = bound.height <= 0 ? window.innerHeight : bound.height;
        this.start();
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
        this.controlItems = await this.reader.decodeFromVideoDevice(selectedDeviceId, this.drawPanel.nativeElement, res => {
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
