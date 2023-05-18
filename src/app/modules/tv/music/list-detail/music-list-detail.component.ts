import { Component, OnInit } from '@angular/core';
import { IMusic, IMusicList } from '../../model';

@Component({
    selector: 'app-music-list-detail',
    templateUrl: './music-list-detail.component.html',
    styleUrls: ['./music-list-detail.component.scss']
})
export class MusicListDetailComponent implements OnInit {

    public data: IMusicList;
    public isLoading = false;
    public items: IMusic[];

    constructor() { }

    ngOnInit() {
    }

    public tapBack() {
        history.back();
    }

}
