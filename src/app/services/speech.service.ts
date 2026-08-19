import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SpeechService {
    readonly isListening = signal<boolean>(false);
    readonly transcript = signal<string>('');
    readonly error = signal<string | null>(null);
    readonly isSupported = signal<boolean>(false);

    private recognition: any = null;

    constructor() {
        this.initRecognition();
    }

    private initRecognition(): void {
        if (typeof window !== 'undefined') {
            const win = window as any;
            const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

            if (SpeechRecognition) {
                this.isSupported.set(true);
                this.recognition = new SpeechRecognition();
                this.recognition.continuous = false;
                this.recognition.interimResults = true;
                this.recognition.lang = 'en-IN'; // Indian English default

                this.recognition.onstart = () => {
                    this.isListening.set(true);
                    this.error.set(null);
                };

                this.recognition.onresult = (event: any) => {
                    let currentTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        currentTranscript += event.results[i][0].transcript;
                    }
                    this.transcript.set(currentTranscript);
                };

                this.recognition.onerror = (event: any) => {
                    this.isListening.set(false);
                    this.error.set(event.error || 'Speech recognition error occurred.');
                };

                this.recognition.onend = () => {
                    this.isListening.set(false);
                };
            } else {
                this.isSupported.set(false);
            }
        }
    }

    startListening(): void {
        if (!this.recognition) {
            this.error.set('Speech recognition is not supported in this browser.');
            return;
        }

        try {
            this.transcript.set('');
            this.recognition.start();
        } catch (err) {
            console.warn('Speech start error:', err);
            this.isListening.set(false);
        }
    }

    stopListening(): void {
        if (this.recognition && this.isListening()) {
            this.recognition.stop();
        }
    }

    toggleListening(): void {
        if (this.isListening()) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }
}
