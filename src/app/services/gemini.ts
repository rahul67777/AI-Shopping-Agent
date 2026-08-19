import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class Gemini {

  private ai = new GoogleGenAI({
    apiKey: environment.geminiApiKey
  });

  async *askAI(messages: ChatMessage[]): AsyncGenerator<string> {

    const contents = messages.map(message => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [
        {
          text: message.text
        }
      ]
    }));

    const stream = await this.ai.models.generateContentStream({
      model: 'gemini-3.6-flash',
      contents
    });

    for await (const chunk of stream) {

      const text = chunk.text;

      if (text) {
        yield text;
      }
    }
  }
}