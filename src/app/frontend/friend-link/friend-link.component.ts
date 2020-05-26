import { Component, OnInit } from '@angular/core';
import { FrontendService } from '../frontend.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ILink } from 'src/app/theme/models/seo';

@Component({
  selector: 'app-friend-link',
  templateUrl: './friend-link.component.html',
  styleUrls: ['./friend-link.component.scss']
})
export class FriendLinkComponent implements OnInit {

    public title = 'Friend Link';

    public friendLinks: ILink[] = [];

    constructor(
        private modalService: NgbModal,
        private service: FrontendService) {
        this.service.friendLinks().subscribe(res => {
            this.friendLinks = res;
        });
    }

    ngOnInit() {
    }

    public openApply(content) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            // TODO
        });
    }

}
