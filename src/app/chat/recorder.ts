export interface IRecorderOption {
    type?: string; // 输出类型：mp3,wav，wav输出文件尺寸超大不推荐使用，但mp3编码支持会导致js文件超大，如果不需支持mp3可以使js文件大幅减小
    bitRate?: number; // 比特率 wav:16或8位，MP3：8kbps 1k/s，8kbps 2k/s 录音文件很小
    sampleRate?: number; // 采样率，wav格式大小=sampleRate*时间；mp3此项对低比特率有影响，高比特率几乎无影响。 wav任意值，mp3取值范围：48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000
    disableEnvInFix?: boolean; // 禁用设备卡顿时音频输入丢失补偿功能
}

export class Recorder {

    constructor(
        option?: IRecorderOption
    ) {
        this.option = Object.assign({type: 'mp3', bitRate: 8, sampleRate: 16000, disableEnvInFix: false}, option || {});
    }

    private booted = false;
    private instance: MediaRecorder;
    private chunks: any[] = [];
    private option: IRecorderOption;

    public get isOpen(): boolean {
        return this.booted && !!this.instance;
    }

    public get state() {
        if (!this.isOpen) {
            return null;
        }
        return this.instance.state;
    }

    public get isPaused(): boolean {
        return this.state !== 'recording';
    }

    public toBlob() {
        const blob = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' });
        this.chunks = [];
        return blob;
    }

    public toURL(): string {
        return URL.createObjectURL(this.toBlob());
    }

    public start() {
        if (!this.isOpen) {
            return;
        }
        this.instance.start();
    }

    public stop() {
        if (!this.isOpen) {
            return;
        }
        this.instance.stop();
    }

    public pause() {
        if (!this.isOpen) {
            return;
        }
        this.instance.pause();
    }

    /**
     * 启用内部的权限申请
     * @returns 
     */
    public open(cb?: () => void) {
        if (this.isOpen) {
            cb && cb();
            return;
        }
        this.booted = false;
        if (!navigator.mediaDevices) {
            return;
        }
        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(stream => {
            this.booted = true;
            this.instance = new MediaRecorder(stream, {
                // mimeType: 'audio/mp3',
                // audioBitsPerSecond: this.option.sampleRate
            });
            this.instance.ondataavailable = e => {
                this.chunks.push(e.data);
            };
            cb && cb();
        })
        .catch(function(err) {
            console.log('The following error occurred: ' + err);
        });
    }
}