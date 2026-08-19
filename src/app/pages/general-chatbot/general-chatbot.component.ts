import { Component, ChangeDetectionStrategy, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { Gemini, ChatMessage } from '../../services/gemini';
import { FormsModule } from '@angular/forms';
import { marked } from 'marked';

@Component({
    selector: 'app-general-chatbot',
    imports: [FormsModule],
    templateUrl: './general-chatbot.component.html',
    styleUrl: './general-chatbot.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralChatbotComponent {
    @ViewChild('chatBody') chatBody!: ElementRef;

    private geminiService = inject(Gemini);

    prompt = signal('');
    messages = signal<ChatMessage[]>([]);
    loading = signal(false);
    streaming = signal(false);
    copiedIndex = signal<number | null>(null);

    async askAI(): Promise<void> {
        const question = this.prompt().trim();
        if (!question || this.loading()) {
            return;
        }

        this.messages.update(messages => [
            ...messages,
            { role: 'user', text: question }
        ]);

        this.prompt.set('');
        this.loading.set(true);
        this.streaming.set(false);

        this.messages.update(messages => [
            ...messages,
            { role: 'ai', text: '' }
        ]);

        this.scrollToBottom();

        try {
            const conversation: ChatMessage[] = [
                ...this.messages().slice(0, -1)
            ];

            let aiResponse = '';

            for await (const chunk of this.geminiService.askAI(conversation)) {
                this.streaming.set(true);
                aiResponse += chunk;

                this.messages.update(messages => {
                    const updatedMessages = [...messages];
                    updatedMessages[updatedMessages.length - 1] = {
                        role: 'ai',
                        text: aiResponse
                    };
                    return updatedMessages;
                });

                this.scrollToBottom();
            }
        } catch (error) {
            console.error('Gemini Error:', error);
            this.messages.update(messages => {
                const updatedMessages = [...messages];
                updatedMessages[updatedMessages.length - 1] = {
                    role: 'ai',
                    text: 'Something went wrong. Please try again.'
                };
                return updatedMessages;
            });
        } finally {
            this.streaming.set(false);
            this.loading.set(false);
        }
    }

    scrollToBottom(): void {
        setTimeout(() => {
            if (this.chatBody) {
                this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
            }
        }, 100);
    }

    newChat(): void {
        this.messages.set([]);
        this.prompt.set('');
        this.loading.set(false);
        this.streaming.set(false);
    }

    formatMessage(text: string): string {
        return marked.parse(text) as string;
    }

    copyText(text: string, index: number): void {
        navigator.clipboard.writeText(text);
        this.copiedIndex.set(index);
        setTimeout(() => {
            if (this.copiedIndex() === index) {
                this.copiedIndex.set(null);
            }
        }, 2000);
    }
}
