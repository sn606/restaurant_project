import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Category, ProductFilters } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly BASE_URL = 'https://restaurant.stepprojects.ge/api';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.BASE_URL}/Products/GetAll`);
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.BASE_URL}/Categories/GetAll`);
  }

  getFilteredProducts(filters: Partial<ProductFilters>): Observable<Product[]> {
    let params = new HttpParams();

    if (filters.spiciness !== null && filters.spiciness !== undefined) {
      params = params.set('spiciness', filters.spiciness.toString());
    }
    if (filters.nuts !== null && filters.nuts !== undefined) {
      params = params.set('nuts', filters.nuts.toString());
    }
    if (filters.vegeterian !== null && filters.vegeterian !== undefined) {
      params = params.set('vegeterian', filters.vegeterian.toString());
    }

    return this.http.get<Product[]>(`${this.BASE_URL}/Products/GetFiltered`, { params });
  }
}