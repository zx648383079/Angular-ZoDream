import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, last, map, Subscription } from 'rxjs';
import { ParallelHasher } from 'ts-md5';
import { IUploadResult } from '../models/open';
import { IErrorResult } from '../models/page';
import { eachObject, uriEncode } from '../utils';
import { inject } from '@angular/core';

export enum UploadStatus {
    Queue,
    Checking,
    Uploading,
    CheckedDone,
    Done,
    Paused,
    Failure,
    Cancelled
}

export interface IUploadServer {
    /**
     * 上传完整文件
     */
    upload: string;
    /**
     * 通过MD5验证
     */
    verify: string;
    /**
     * 分块上传
     */
    chunk: string;
    /**
     * 合并分块
     */
    merge: string;
}

export interface ICustomFormData {
    [key: string]: any;
}

export interface IUploadChunk {
    start: number;
    end: number;
}

export class UploadFile<T = IUploadResult> {


    private http = inject(HttpClient);

    public $status: BehaviorSubject<UploadStatus> = new BehaviorSubject(UploadStatus.Queue);
    public $progress: BehaviorSubject<number> = new BehaviorSubject(0);
    public $finish: BehaviorSubject<T> = new BehaviorSubject(null);

    private server: IUploadServer;
    private chunkSize = 1024 * 1024;
    private partName = 'file';
    private lastStatus = UploadStatus.Queue;
    private uploaded = 0;
    private uploadQueue: Subscription;
    private waitQueue: number[] = [];
    private chunkItems: IUploadChunk[] = [];

    constructor(
        url: string|IUploadServer,
        private file: File,
        private customFormData: ICustomFormData = {},
        private md5 = '',
    ) {
        this.server = typeof url === 'string' ? 
                    {
                        upload: url, 
                        verify: uriEncode(url, {step: 'check'}),
                        chunk: uriEncode(url, {step: 'chunk'}),
                        merge: uriEncode(url, {step: 'merge'}),
                    } : {...url};
        let i = 0;
        const maxI = Math.ceil(this.length / this.chunkSize);
        while (i < maxI) {
            this.waitQueue.push(i);
            const start = i * this.chunkSize;
            const end = Math.min(start + this.chunkSize, this.length);
            this.chunkItems.push({
                start,
                end 
            });
            i ++;
        }
    }

    private set status(arg: UploadStatus) {
        if (arg === UploadStatus.Paused || arg === UploadStatus.Cancelled || arg === UploadStatus.Failure) {
            this.lastStatus = this.$status.value;
        }
        this.$status.next(arg);
    }

    public get length() {
        return this.file.size;
    }

    /**
     * 待上传的文件大小
     */
    private get unloadSize(): number {
        let total = 0;
        for (const i of this.waitQueue) {
            const chunk = this.chunkItems[i];
            total += chunk.start - chunk.end;
        }
        return total;
    }

    /**
     * 已上传的文件大小
     */
    private get loadSize(): number {
        let total = 0;
        for (let i = 0; i < this.chunkItems.length; i++) {
            if (this.waitQueue.indexOf(i) >= 0) {
                continue;
            }
            const chunk = this.chunkItems[i];
            total += chunk.start - chunk.end;
        }
        return total;
    }

    public start() {
        switch (this.lastStatus) {
            case UploadStatus.Queue:
            case UploadStatus.Checking:
                this.checkMd5();
                break;
            case UploadStatus.Uploading:
                this.uploadFile();
                break;
            default:
                break;
        }
    }

    public pause() {
        if (this.$status.value === UploadStatus.Uploading) {
            this.uploadQueue.unsubscribe();
        }
        this.status = UploadStatus.Paused;
    }

    public stop() {
        if (this.$status.value === UploadStatus.Uploading) {
            this.uploadQueue.unsubscribe();
        }
        this.status = UploadStatus.Cancelled;
    }

    private checkMd5() {
        this.status = UploadStatus.Checking;
        if (this.md5) {
            this.checkQuickly();
            return;
        }
        const hasher = new ParallelHasher('/md5/md5_worker.js');
        hasher.hash(this.file).then((md5: string) => {
            this.md5 = md5;
            this.checkQuickly();
        }).catch(_ => {
            this.status = UploadStatus.Failure;
        });
    }

    private checkQuickly() {
        this.http.post<T>(this.server.verify, {
            ...this.customFormData,
            md5: this.md5
        }).subscribe({
            next: res => {
                this.status = UploadStatus.CheckedDone;
                this.$finish.next(res);
            },
            error: _ => {
                this.uploadFile();
            }
        })
    }

    private uploadFile() {
        this.status = UploadStatus.Uploading;
        if (this.chunkItems.length <= 1) {
            this.uploadAll();
            return;
        }
        this.uploadChunk();
    }

    private uploadAll() {
        this.uploaded = 0;
        this.uploadBlob<T>(this.server.upload, this.file, res => {
            this.waitQueue = [];
            this.$finish.next(res);
            this.uploaded = this.length;
            this.status = UploadStatus.Done;
        }, _ => {
            this.status = UploadStatus.Failure;
        }, {
            ...this.customFormData,
            md5: this.md5,
            name: this.file.name
        });
    }

    private uploadChunk() {
        if (this.waitQueue.length === 0) {
            this.uploadChunkMerge();
            return;
        }
        const i = this.waitQueue.shift();
        const chunk = this.chunkItems[i];
        this.uploadBlob(this.server.chunk, this.file.slice(chunk.start, chunk.end), _ => {
            this.uploaded = this.loadSize;
            this.uploadChunk();
        }, _ => {
            this.status = UploadStatus.Failure;
        }, {
            name: this.renderTempName(i),
        });
    }

    private uploadChunkMerge() {
        this.uploadQueue = undefined;
        const files: string[] = this.chunkItems.map((_, i) => this.renderTempName(i));
        this.http.post<T>(this.server.merge, {
            ...this.customFormData,
            name: this.file.name,
            md5: this.md5,
            files
        }).subscribe({
            next: res => {
                this.$finish.next(res);
                this.status = UploadStatus.Done;
            },
            error: _ => {
                this.waitQueue = this.chunkItems.map((_, i) => i);
                this.status = UploadStatus.Failure;
                // TODO 可以通过接口返回未找到的部分，加入上传等待队列进行部分补充上传
            }
        });
    }

    private renderTempName(i: number): string {
        return `${this.md5}_${i}`;
    }

    private splitTempIndex(name: string): number {
        const i = name.indexOf('_');
        return i < 0 ? 0 : parseInt(name.substring(i + 1));
    }

    private uploadBlob<K = IUploadResult>(url: string, file: Blob, onSuccess: (data: K) => void, onFailure: (data: IErrorResult) => void, appendForm: any = {}) {
        const form = new FormData();
        eachObject(appendForm, (v, k) => {
            form.append(k as any, v);
        });
        form.append(this.partName, this.file);
        const req = new HttpRequest('POST', url, form, {
            reportProgress: true
        });
        const maxSize = file.size;
        this.uploadQueue = this.http.request(req).pipe(
            map((event: HttpEvent<any>) => {
                switch (event.type) {
                    case HttpEventType.Response:
                        return event.body;
                    case HttpEventType.UploadProgress:
                        this.$progress.next(this.uploaded + Math.min(event.loaded, maxSize));
                    default:
                        return 'uploading';
                }
            }),
            last(),
        ).subscribe({
            next: res => {
                onSuccess(res);
            },
            error: err => {
                onFailure(err);
            }
        });
    }
}