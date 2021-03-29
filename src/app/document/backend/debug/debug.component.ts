import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DocumentService } from '../document.service';

interface IOptionItem {
    checked?: boolean;
    key: string;
    value: any;
    type?: number;
}

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent {

    public methodItems = ['GET', 'POST', 'PUT', 'DELETE', 'OPTION'];
    public method = 'GET';
    public url = '';
    public headerItems: IOptionItem[] = [];
    public headerName = [
        'Host',
        'User-Agent',
        'Accept',
        'Accept-Language',
        'Accept-Encoding',
        'If-Modified-Since',
        'Cookie',
        'Referer',
        'Authorization',
    ];
    public requestIndex = 0;
    public bodyType = 0;
    public body: any;
    public typeItems = ['none', 'form-data', 'x-www-form-urlencoded', 'raw', 'binary'];
    public rawType = 0;
    public rawItems = ['Text', 'JavaScript', 'JSON', 'HTML', 'XML'];
    public optionItems = ['Text', 'File'];
    public responseStatus = '';
    public responseTime = 0;
    public responseSize = 0;
    public responseIndex = 0;
    public responseBody = '';
    public responseHeader: IOptionItem[] = [];

    constructor(
        private service: DocumentService,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
    ) { }

    public tapSend() {
        this.service.apiDebug({
            url: this.url,
            method: this.method,
            type: this.typeItems[this.bodyType],
            raw_type: this.rawItems[this.rawType],
            body: this.body,
        }).subscribe(res => {
            
        });
    }

    public tapAddHeader() {
        this.headerItems.push({
            checked: false,
            key: '',
            value: ''
        });
    }

    public tapRemoveHeader(i: number) {
        this.headerItems.splice(i, 1);
    }

    public onTypeChange() {
        this.body = this.bodyType > 0 && this.bodyType < 3 ? [] : '';
    }

    public tapAddBody() {
        if (!(this.body instanceof Array)) {
            this.body = [];
        }
        this.body.push({
            checked: false,
            key: '',
            value: '',
            type: 0,
        });
    }

    public tapRemoveBody(i: number) {
        if (!(this.body instanceof Array)) {
            this.body = [];
            return;
        }
        this.body.splice(i, 1);
    }

    public uploadFile(event: any, item?: IOptionItem) {
        const files = event.target.files as FileList;
        if (item) {
            item.value = files[0];
            item.type = 1;
            return;
        }
        this.body = files[0];
    }

}
