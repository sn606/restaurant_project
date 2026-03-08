import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BasketItem } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly BASE_URL = 'https://restaurant.stepprojects.ge/api/Baskets';

  constructor(private http: HttpClient) {}

  getAll(): Observable<BasketItem[]> {
    return this.http.get<BasketItem[]>(`${this.BASE_URL}/GetAll`);
  }

  addToCart(productId: number, price: number): Observable<any> {
    return this.http.post(`${this.BASE_URL}/AddToBasket`, 
      { productId, quantity: 1, price },
      { headers: { 'Content-Type': 'application/json' }, responseType: 'text' }
    );
  }

  updateBasket(productId: number, quantity: number, price: number): Observable<any> {
    return this.http.put(`${this.BASE_URL}/UpdateBasket`,
      { productId, quantity, price },
      { headers: { 'Content-Type': 'application/json' }, responseType: 'text' }
    );
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/DeleteProduct/${productId}`, {
      responseType: 'text'
    });
  }
}