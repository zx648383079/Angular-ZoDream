import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { assetUri, parseNumber, uriEncode } from '../../../theme/utils';
import { IDataOne } from '../../../theme/models/page';

@Component({
    selector: 'app-visual-studio',
    templateUrl: './visual-studio.component.html',
    styleUrls: ['./visual-studio.component.scss']
})
export class VisualStudioComponent implements OnInit, AfterViewInit {

    @ViewChild('browser', {static: true})
    private frame: ElementRef<HTMLIFrameElement>;

    public isLoading = true;
    private isReady = false;
    private readyFn: (frame: HTMLIFrameElement) => void;
    private data = {
        site: 0,
        id: 0
    };

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.data = {
                site: parseNumber(params.site),
                id: parseNumber(params.id)
            };
        });
        this.http.get<IDataOne<string>>('auth/user/ticket').subscribe({
            next: res => {
                const url = assetUri(uriEncode('auth', {ticket: res.data,  redirect_uri: uriEncode('tpl/admin/visual', this.data)}, true));
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
        const frame = this.frame.nativeElement;
        if (!frame) {
            return;
        }
        this.isReady = true;
        frame.onload = () => {
            this.isLoading = false;
        };
        this.readyFn && this.readyFn(frame);
    }

    private onReady(cb: (frame: HTMLIFrameElement) => void) {
        this.readyFn = cb;
        if (!this.isReady) {
            return;
        }
        this.readyFn && this.readyFn(this.frame.nativeElement);
    }

}
