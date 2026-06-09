import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) {}

  ask(message: string): Observable<any> {
    return this.http.post(
      'https://localhost:7275/api/chat',
      {
        message
      }
    );
  }
}