import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DialogService } from '../../dialog';
import videojs, { VideoJsPlayer } from 'video.js';
import { IComment, IVideo } from '../model';
import { VideoService } from '../video.service';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.scss']
})
export class VideoDetailComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('player')
    private videoElement: ElementRef;
    private audioElement: HTMLAudioElement;
    private videoPlayer: VideoJsPlayer;

    public isPlaying = false;
    public data: IVideo;
    public items: IVideo[] = [];
    public isLoading = false;
    public page = 1;
    private index = -1;
    private queries: any = {};

    public commentData = {
        video_id: 0,
        content: '',
        parent_id: 0,
        items: [],
        page: 1,
        hasMore: true,
    };

    constructor(
        private service: VideoService,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.tapRefresh(() => {
            if (this.items.length < 1) {
                return;
            }
            this.index = 0;
            this.data = this.items[0];
            setTimeout(() => {
                this.tapPlay();
            }, 1000);
        });
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

    ngAfterViewInit() {
        this.bindVideoEvent();
    }

    ngOnDestroy() {
        this.stop();
    }

    public tapUser() {

    }

    public tapToggleLike() {
        if (!this.data) {
            return;
        }
        this.service.videoLike(this.data.id).subscribe(res => {
            if (this.data.id !== res.id) {
                return;
            }
            this.data.is_liked = res.is_liked;
            this.data.like_count = res.like_count;
        });
    }

    public tapShowComment() {

    }

    public tapPlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    public tapStop() {
        this.stop();
    }


    public play() {
        this.isPlaying = true;
        this.video.src(this.data.video_path);
        this.video.play();
        if (this.data.music && this.data.music.path) {
            this.audio.src = this.data.music.path;
            this.audio.play();
        }
    }

    public pause() {
        this.isPlaying = false;
        this.video.pause();
        this.audio.pause();
    }

    public stop() {
        this.isPlaying = false;
        this.video.src('');
        this.audio.src = '';
    }

    public tapPrevious() {
        this.flipVideo(this.index, this.index - 1);
    }

    public tapNext() {
        this.flipVideo(this.index, this.index + 1);
    }

    private flipVideo(from: number, to: number) {
        this.tapStop();
        if (to < 0) {
            this.toastrService.warning($localize `Can't move on anymore`)
            return;
        }
        if (this.items.length <= to) {
            this.tapMore(() => {
                this.flipAnimation(from, to);
            });
            return;
        }
        this.flipAnimation(from, to);
    }

    private flipAnimation(from: number, to: number) {
        this.data = this.items[to];
        setTimeout(() => {
            this.tapPlay();
        }, 500);
    }

    private bindVideoEvent() {
        const video = this.video;
        video.on('timeupdate', () => {
        });
        video.on('ended', () => {
            this.isPlaying = false;
            this.tapNext();
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
        });
        this.audioElement.addEventListener('ended', () => {
            // this.isPlaying = false;
        });
        this.audioElement.addEventListener('pause', () => {
            // this.isPlaying = false;
        });
        this.audioElement.addEventListener('play', () => {
            // this.isPlaying = true;
        });
    }

    public tapMore(success?: () => void) {
        this.goPage(this.page + 1, success);
    }

    /**
     * refresh
     */
    public tapRefresh(success?: () => void) {
        this.goPage(1, success);
    }

    public goPage(page: number, success?: () => void) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.videoList(Object.assign({page}, this.queries)).subscribe(res => {
            this.page = res.paging.offset;
            this.isLoading = false;
            this.items = res.paging.offset < 2 ? res.data :  [].concat(this.items as never[], res.data as never[]);
            success && success();
        }, _ => {
            this.isLoading = false;
        });
    }


    public tapCommenting(item: IComment) {
        this.commentData.parent_id = item.id;
        this.commentData.content = '回复 @' + item.user.name;
    }

    public tapCommentSubmit() {
        if (!this.commentData.content || this.commentData.content.trim().length < 1) {
            this.toastrService.warning($localize `Please input the comment`);
            return;
        }
        this.service.commentSave({
            video_id: this.commentData.video_id,
            content: this.commentData.content,
            parent_id: this.commentData.content.indexOf('回复 @') === 0 ? this.commentData.parent_id : 0,
        }).subscribe(_ => {
            this.toastrService.success($localize `Successfully comment`);
            this.commentData.parent_id = 0;
            this.commentData.content = '';
        });
    }


    public tapRefreshComment() {
        this.goCommentPage(1);
    }

    public tapMoreComment() {
        if (!this.commentData.hasMore) {
            return;
        }
        this.goCommentPage(this.commentData.page + 1);
    }

    public goCommentPage(page: number) {
        const video = this.commentData.video_id;
        this.service.commentList({
            video,
            page
        }).subscribe(res => {
            if (video !== this.commentData.video_id) {
                return;
            }
            this.commentData.page = res.paging.offset;
            this.commentData.items = res.paging.offset < 2 ? res.data :  [].concat(this.commentData.items as never[], res.data as never[]);
        });
    }

}
