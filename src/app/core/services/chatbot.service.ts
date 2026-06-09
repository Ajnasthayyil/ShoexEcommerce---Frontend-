import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ChatRequest } from '../../features/chatbot/models/chat-request.model';
import { ChatResponse } from '../../features/chatbot/models/chat-response.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private readonly apiUrl = `${environment.apiUrl}/chat`;

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<string> {
    const request: ChatRequest = { message };
    return this.http.post<ChatResponse>(this.apiUrl, request).pipe(
      map(res => res.response),
      catchError(err => {
        console.error('Chatbot API error', err);
        throw err;
      })
    );
  }
}
