import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OnlineBackendService } from './online.service';

@Component({
  selector: 'app-service-backend',
  templateUrl: './service-backend.component.html',
  styleUrls: ['./service-backend.component.scss']
})
export class ServiceBackendComponent implements OnInit {

    public tabIndex = 0;

    constructor(
        private service: OnlineBackendService,
        private toastrService: ToastrService,
        private modalService: NgbModal,
    ) { }

    ngOnInit() {
    }

    public onReplyChange(event: any) {

    }

    public openTransfer(modal: any) {

    }

    public openRemark(modal: any) {

    }

    public tapClose() {

    }

    public tapEmoji(item: any) {

    }

    public uploadImage(event: any) {

    }

    public uploadVideo(event: any) {

    }

    public uploadFile(event: any) {

    }

}
