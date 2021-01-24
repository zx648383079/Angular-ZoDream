import {
    Component,
    OnInit,
    ElementRef,
    ViewChild,
    AfterViewInit,
    Output,
    EventEmitter
} from '@angular/core';
import videojs, { VideoJsPlayer } from 'video.js';

interface IFile {
    name?: string;
    type?: string;
    size?: number;
    thumb?: string;
    url?: string;
}

@Component({
    selector: 'app-media-player',
    templateUrl: './media-player.component.html',
    styleUrls: ['./media-player.component.scss']
})
export class MediaPlayerComponent implements OnInit, AfterViewInit {

    @ViewChild('playerVideo')
    private videoElement: ElementRef;

    private audioElement: HTMLAudioElement;

    private videoPlayer: VideoJsPlayer;

    public progress = 0;

    public volume = 100;

    public isPlaying = false;

    public file: IFile = {
        name: '未知',
        thumb: 'http://zodream.localhost/assets/images/favicon.png',
    };

    @Output() public nextFile = new EventEmitter();
    @Output() public previousFile = new EventEmitter();

    constructor() {}

    get boxStyle(): string {
        if (!this.file || !this.file.type) {
            return '';
        }
        return 'player-' + this.file.type;
    }

    get audio(): HTMLAudioElement {
        if (!this.audioElement) {
            this.audioElement = document.createElement('audio');
            this.bindAudioEvent();
        }
        return this.audioElement;
    }

    get video(): VideoJsPlayer {
        if (!this.videoPlayer) {
            this.videoPlayer = videojs(this.videoElement.nativeElement);
        }
        return this.videoPlayer;
    }

    ngOnInit() {}

    ngAfterViewInit() {
        this.bindVideoEvent();
    }

    public tapVolumeToggle() {
        this.volume = this.volume > 0 ? 0 : 100;
    }

    public tapVolumeChange() {
        if (this.audioElement) {
            this.audioElement.volume = this.volume / 100;
        }
        this.video.volume(this.volume / 100);
    }

    public tapProgressChange() {
        if (this.file.type === 'music' && !isNaN(this.audio.duration) && this.audio.duration > 0) {
            this.audioElement.currentTime = this.progress * this.audio.duration / 100;
        }
        if (this.file.type === 'movie' && !isNaN(this.video.duration()) && this.video.duration() > 0) {
            this.video.currentTime(this.progress * this.video.duration() / 100);
        }
    }

    public tapPlay() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.play();
        } else {
            this.pause();
        }
    }

    public tapStop() {
        this.isPlaying = false;
        this.stop();
    }

    public tapPrevious() {
        this.previousFile.emit(this);
    }

    public tapNext() {
        this.nextFile.emit(this);
    }

    public play(file?: IFile) {
        this.isPlaying = true;
        if (file) {
            this.tapStop();
            this.file = file;
        }
        if (this.file.type === 'image') {
            return;
        }
        if (this.file.type === 'music') {
            if (file) {
                this.audio.src = this.file.url;
            }
            this.audio.play();
            return;
        }
        if (this.file.type === 'movie') {
            if (file) {
                this.video.src({
                    src: this.file.url,
                    type: 'application/x-mpegURL'
                });
            }
            this.video.play();
            return;
        }
    }

    public pause() {
        if (this.file.type === 'music') {
            this.audio.pause();
            return;
        }
        if (this.file.type === 'movie') {
            this.video.pause();
        }
    }

    public stop() {
        if (this.file.type === 'music') {
            this.audio.src = '';
            return;
        }
        if (this.file.type === 'movie') {
            this.video.src('');
        }
    }

    public next() {

    }

    public previous() {}

    private bindVideoEvent() {
        const video = this.video;
        video.on('timeupdate', () => {
            this.progress = isNaN(video.duration()) || video.duration() <= 0 ? 0 :
                video.currentTime() * 100 / video.duration();
        });
        video.on('ended', () => {
            this.isPlaying = false;
        });
        video.on('pause', () => {
            this.isPlaying = false;
        });
        video.on('play', () => {
            this.isPlaying = true;
        });
    }

    private bindAudioEvent() {
        this.audioElement.addEventListener('timeupdate', () => {
            this.progress = isNaN(this.audioElement.duration) || this.audioElement.duration <= 0 ? 0 :
                this.audioElement.currentTime * 100 / this.audioElement.duration;
        });
        this.audioElement.addEventListener('ended', () => {
            this.isPlaying = false;
        });
        this.audioElement.addEventListener('pause', () => {
            this.isPlaying = false;
        });
        this.audioElement.addEventListener('play', () => {
            this.isPlaying = true;
        });
    }
}
