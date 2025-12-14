import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, inject, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDataOne } from '../../../theme/models/page';
import { DialogService } from '../../../components/dialog';
import { assetUri, parseNumber, uriEncode } from '../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, AfterViewInit {
    private http = inject(HttpClient);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    private readonly frame = viewChild<ElementRef<HTMLIFrameElement>>('browser');

    public isLoading = true;
    public navToggle = 1;
    private isReady = false;
    private readyFn: (frame: HTMLIFrameElement) => void;
    private data = {
        site: 0,
        id: 0
    };

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.data = {
                site: parseNumber(params.site),
                id: parseNumber(params.id)
            };
        });
        this.http.get<IDataOne<string>>('auth/user/ticket').subscribe({
            next: res => {
                const url = assetUri(uriEncode('auth', {ticket: res.data,  redirect_uri: uriEncode('tpl/admin/visual/preview', this.data)}));
                this.onReady(frame => {
                    frame.src = url;
                });
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    ngAfterViewInit(): void {
        const frame = this.frame().nativeElement;
        if (!frame) {
            return;
        }
        this.isReady = true;
        frame.onload = () => {
            this.isLoading = false;
        };
        this.readyFn && this.readyFn(frame);
    }

    public tapClose() {
        this.navToggle = 0;
    }

    private onReady(cb: (frame: HTMLIFrameElement) => void) {
        this.readyFn = cb;
        if (!this.isReady) {
            return;
        }
        this.readyFn && this.readyFn(this.frame().nativeElement);
    }

}
