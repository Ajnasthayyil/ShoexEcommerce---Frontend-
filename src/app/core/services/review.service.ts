import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProductReviewDto {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  reviewText: string;
  createdOn: string;
}

export interface AddProductReviewDto {
  productId: number;
  rating: number;
  reviewText: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  getReviewsByProductId(productId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/product/${productId}`);
  }

  addReview(dto: AddProductReviewDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto, { withCredentials: true });
  }
}
