import { Component, inject, OnInit, signal } from '@angular/core';
import { IMusic, IMusicList } from '../../model';
import { Location } from '@angular/common';

@Component({
    standalone: false,
    selector: 'app-music-list-detail',
    templateUrl: './music-list-detail.component.html',
    styleUrls: ['./music-list-detail.component.scss']
})
export class MusicListDetailComponent implements OnInit {

    private readonly location = inject(Location);
    
    public data: IMusicList;
    public readonly isLoading = signal(false);
    public readonly items = signal<IMusic[]>([]);

    ngOnInit() {
    }

    public tapBack() {
        this.location.back();
    }

}
