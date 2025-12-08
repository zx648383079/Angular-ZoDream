import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IDataOne } from '../models/page';
import { IUser } from '../models/user';

@Injectable()
export class WebAuthn {

    constructor(
        private http: HttpClient
    ) {
        this.ready();
    }

    private readonly chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    private lookup = new Uint8Array(256);
    private booted = false;

    public get enabled(): boolean {
        return !!navigator.credentials;
    }

    public get() {
        const subject = new Subject<IUser>();
        if (!this.enabled) {
            subject.error('unsupport');
            return subject;
        }
        this.http.get<IDataOne<any>>('auth/passkey').subscribe({
            next: res => {
                const data = res.data;
                data.challenge = this.toBuffer(data.challenge);
                navigator.credentials.get({
                    publicKey: data
                })
                .then((credential: any) => {
                    const response = credential.response as AuthenticatorAssertionResponse;
                    this.http.post<IUser>('auth/passkey/login', {
                        credential: {
                            id: credential.id,
                            clientDataJSON: this.encode(response.clientDataJSON),
                            authenticatorData: this.encode(response.authenticatorData),
                            userHandle: this.encode(response.userHandle),
                            signature: this.encode(response.signature)
                        }
                    }).subscribe({
                        next: subject.next.bind(subject),
                        error: subject.error.bind(subject)
                    });
                })
                .catch(err => {
                    console.error(err);
                    subject.error($localize `webauthn canceled`);
                });
            },
            error: subject.error.bind(subject)
        });
        return subject;
    }

    public create() {
        const subject = new Subject<boolean>();
        if (!this.enabled) {
            subject.error('unsupport');
            return subject;
        }
        this.http.get<IDataOne<any>>('auth/passkey/register_option').subscribe({
            next: res => {
                const data = res.data;
                data.challenge = this.toBuffer(data.challenge);
                data.user.id = this.toBuffer(data.user.id);
                navigator.credentials.create({
                    publicKey: data
                })
                .then((credential: any) => {
                    const response = credential.response as AuthenticatorAttestationResponse;
                    this.http.post<boolean>('auth/passkey/register', {credential: {
                        id: credential.id,
                        clientDataJSON: this.encode(response.clientDataJSON),
                        attestationObject: this.encode(response.attestationObject),
                        publicKeyAlgorithm: response.getPublicKeyAlgorithm(),
                        // transports: response.getTransports(),
                        // authenticatorData: Base64.encode(response.getAuthenticatorData())
                    }}).subscribe({
                        next: subject.next.bind(subject),
                        error: subject.error.bind(subject)
                    });
                })
                .catch(err => {
                    console.error(err);
                    subject.error($localize `webauthn canceled`);
                });
            },
            error: subject.error.bind(subject)
        });
        return subject;
    }



    private ready() {
        if (this.booted) {
            return;
        }
        this.booted = true;
        for (let i = 0; i < this.chars.length; i++) {
            this.lookup[this.chars.charCodeAt(i)] = i;
        }
    }
    
    public encode(arraybuffer: ArrayBuffer|null): string {
        if (!arraybuffer) {
            return '';
        }
        const bytes = new Uint8Array(arraybuffer);
        const len = bytes.length;
        let base64 = '';
      
        for (let i = 0; i < len; i += 3) {
            base64 += this.chars[bytes[i] >> 2];
            base64 += this.chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
            base64 += this.chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
            base64 += this.chars[bytes[i + 2] & 63];
        }
      
        if (len % 3 === 2) {
            base64 = base64.substring(0, base64.length - 1);
        } else if (len % 3 === 1) {
            base64 = base64.substring(0, base64.length - 2);
        }
      
        return base64;
    }

    public decode(base64: string): ArrayBuffer {
        const len = base64.length;
        const bufferLength = len * 0.75;
        const arraybuffer = new ArrayBuffer(bufferLength);
        const bytes = new Uint8Array(arraybuffer);
      
        let p = 0;
        for (let i = 0; i < len; i += 4) {
            const encoded1 = this.lookup[base64.charCodeAt(i)];
            const encoded2 = this.lookup[base64.charCodeAt(i + 1)];
            const encoded3 = this.lookup[base64.charCodeAt(i + 2)];
            const encoded4 = this.lookup[base64.charCodeAt(i + 3)];
        
            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        }
      
        return arraybuffer;
    }

    public toBuffer(val: string): Uint8Array<ArrayBuffer> {
        const items: number[] = [];
        for (let i = 0; i < val.length; i++) {
            items.push(val.charCodeAt(i));
        }
        return new Uint8Array(items);
    }
}