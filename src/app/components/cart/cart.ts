import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { BasketItem } from '../../models/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit {
  cartItems: BasketItem[] = [];
  totalAmount = 0;

  constructor(
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getAll().subscribe(items => {
      this.cartItems = [...items];
      this.totalAmount = this.cartItems.reduce(
        (sum, item) => sum + item.quantity * item.price, 0
      );
      this.cdr.detectChanges();
    });
  }

  changeQty(item: BasketItem, newQty: number): void {
    if (newQty < 1) {
      this.removeItem(item);
      return;
    }
    this.cartService.updateBasket(item.product.id, newQty, item.price).subscribe(() => {
      this.loadCart();
    });
  }

  removeItem(item: BasketItem): void {
    this.cartService.deleteProduct(item.product.id).subscribe(() => {
      this.loadCart();
    });
  }

  getItemTotal(item: BasketItem): number {
    return item.quantity * item.price;
  }

  checkout(): void {
    if (this.totalAmount === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert(`Thank you for your order!\nTotal: ${this.totalAmount.toFixed(2)} ₾`);
  }
}