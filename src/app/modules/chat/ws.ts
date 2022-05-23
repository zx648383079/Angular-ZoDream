import { eachObject, fileToBase64 } from '../../theme/utils';
import { COMMAND_AUTH, COMMAND_MESSAGE_PING, IRequest, RequestCallback } from './http';

interface IWsOption {
    prefix?: string;
    separator?: string;
}

enum WsMessageType {
    STRING,
    INT,
    BOOL,
    JSON = 4,
}

type EmptyFunc = () => void;

export class WsRequest implements IRequest {
    constructor(endpoint: string, protocols?: any) {
        if (endpoint.indexOf('ws') === -1) {
            endpoint = 'ws://' + endpoint;
        }
        if (protocols && protocols.length > 0) {
            this.conn = new WebSocket(endpoint, protocols);
        }
        else {
            this.conn = new WebSocket(endpoint);
        }
        this.conn.onopen = () => {
            this.fireConnect();
            this.isReady = true;
            return null;
        };
        this.conn.onclose = () => {
            this.fireDisconnect();
            return null;
        };
        this.conn.onmessage = (evt: MessageEvent<any>) => {
            this.messageReceivedFromConn(evt);
        };
    }

    private option: IWsOption = {
        prefix: 'ws-message:',
        separator: ';',
    };

    private conn: WebSocket;

    private isReady = false;

    private connectListeners: EmptyFunc[] = [];

    private disconnectListeners: EmptyFunc[] = [];

    private nativeMessageListeners: RequestCallback[] = [];

    private messageListeners: {
        [key: string]: RequestCallback[]
    } = {};

    public isNumber(obj: any): boolean {
        return !isNaN(obj - 0) && obj !== null && obj !== '' && obj !== false;
    }

    public isString(obj: any): boolean {
        return typeof obj === 'string';
    }

    public isBoolean(obj: any) {
        return typeof obj === 'boolean' ||
            (typeof obj === 'object' && typeof obj.valueOf() === 'boolean');
    }

    public isJSON(obj: string) {
        return typeof obj === 'object';
    }

    public toMsg(event: string, websocketMessageType: WsMessageType, dataMessage: string) {
        return this.option.prefix + event + this.option.separator + String(websocketMessageType) + this.option.separator + dataMessage;
    }
    public encodeMessage(event: string, data: any) {
        let m = '';
        let t = WsMessageType.STRING;
        if (this.isNumber(data)) {
            t = WsMessageType.INT;
            m = data.toString();
        }
        else if (this.isBoolean(data)) {
            t = WsMessageType.BOOL;
            m = data.toString();
        }
        else if (this.isString(data)) {
            t = WsMessageType.STRING;
            m = data.toString();
        }
        else if (this.isJSON(data)) {
            t = WsMessageType.JSON;
            m = JSON.stringify(data);
        }
        else if (data !== null && typeof(data) !== 'undefined' ) {
            console.log('unsupported type of input argument passed, try to not include this argument to the \'Emit\'');
        }
        return this.toMsg(event, t, m);
    }
    public decodeMessage(event: string, websocketMessage: string): any {
        // websocket-message;user;4;themarshaledstringfromajsonstruct
        const skipLen = this.option.prefix.length + this.option.separator.length + event.length + 2;
        if (websocketMessage.length < skipLen + 1) {
            return null;
        }
        const websocketMessageType = parseInt(websocketMessage.charAt(skipLen - 2), 10);
        const theMessage = websocketMessage.substring(skipLen, websocketMessage.length);
        if (websocketMessageType === WsMessageType.INT) {
            return parseInt(theMessage, 10);
        }
        if (websocketMessageType === WsMessageType.BOOL) {
            return Boolean(theMessage);
        }
        if (websocketMessageType === WsMessageType.STRING) {
            return theMessage;
        }
        if (websocketMessageType === WsMessageType.JSON) {
            return JSON.parse(theMessage);
        }
        return null;
    }
    public getWebsocketCustomEvent(websocketMessage: string) {
        const websocketMessagePrefixAndSepIdx = this.option.prefix.length + this.option.separator.length - 1;
        if (websocketMessage.length < websocketMessagePrefixAndSepIdx) {
            return '';
        }
        const s = websocketMessage.substring(websocketMessagePrefixAndSepIdx, websocketMessage.length);
        return s.substring(0, s.indexOf(this.option.separator));
    }
    public getCustomMessage(event: string, websocketMessage: any) {
        const eventIdx = websocketMessage.indexOf(event + this.option.separator);
        return websocketMessage.substring(eventIdx + event.length + this.option.separator.length + 2, websocketMessage.length);
    }
    public messageReceivedFromConn(evt: MessageEvent<string>) {
        const message = evt.data;
        if (message.indexOf(this.option.prefix) !== -1) {
            const event1 = this.getWebsocketCustomEvent(message);
            if (event1 !== '') {
                // it's a custom message
                this.trigger(event1, this.decodeMessage(event1, message));
                return;
            }
        }
        this.fireNativeMessage(message);
    }
    public onConnect(fn: EmptyFunc) {
        if (this.isReady) {
            fn();
        }
        this.connectListeners.push(fn);
        return this;
    }
    public fireConnect() {
        this.connectListeners.forEach(cb => {
            cb();
        });
    }
    public onDisconnect(fn: EmptyFunc) {
        this.disconnectListeners.push(fn);
        return this;
    }
    public fireDisconnect() {
        this.disconnectListeners.forEach(cb => {
            cb();
        });
    }
    public onMessage(cb: RequestCallback) {
        this.nativeMessageListeners.push(cb);
        return this;
    }
    public fireNativeMessage(websocketMessage: any) {
        this.nativeMessageListeners.forEach(cb => {
            cb(websocketMessage);
        });
        return this;
    }
    public on(event: string|string[], cb: RequestCallback): IRequest {
        eachObject(event, item => {
            if (!item) {
                return;
            }
            if (this.messageListeners[item] == null || this.messageListeners[item] === undefined) {
                this.messageListeners[item] = [];
            }
            this.messageListeners[item].push(cb);
        });
        return this;
    }
    public trigger(event: string, message?: any) {
        const listeners = this.messageListeners[event];
        if (!listeners) {
            return;
        }
        listeners.forEach(cb => {
            cb(message);
        });
    }
    public open(cb: () => void): IRequest {
        return this.onConnect(cb);
    }

    public auth(token: string): IRequest {
        this.emit(COMMAND_AUTH, token);
        return this;
    }

    public close() {
        this.conn.close();
    }
    public emitMessage(websocketMessage: any) {
        this.conn.send(websocketMessage);
        return this;
    }
    public emit(event: string, data?: any): IRequest {
        if (event === COMMAND_MESSAGE_PING) {
            return this;
        }
        if (typeof data === 'object' && data instanceof FormData) {
            return this.emitForm(event, data);
        }
        this.emitMessage(this.encodeMessage(event, data));
        return this;
    }

    public emitForm(event: string, data: FormData): IRequest {
        const items: any = {};
        let count = 0;
        data.forEach((val, key) => {
            if (typeof val === 'object') {
                count++;
                fileToBase64(val, text => {
                    count --;
                    items[key] = text;
                    items[key + '_name'] = val.name
                    if (count < 1) {
                        this.emitMessage(this.encodeMessage(event, items));
                    }
                });
                return;
            }
            items[key] = /^\d+$/.test(val) ? parseInt(val) : val;
        });
        if (count < 1) {
            this.emitMessage(this.encodeMessage(event, items));
        }
        return this;
    }

    public emitBatch(data: {
        [key: string]: any
    }): IRequest {
        eachObject(data, (item, key: string) => {
            this.emit(key, item);
        });
        return this;
    }
}
