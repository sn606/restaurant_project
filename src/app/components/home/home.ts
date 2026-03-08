// davamate ChangeDetectorRef rom gamochndes produqtebi egreve
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { Product, Category, ProductFilters } from '../../models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  // Slider 1
  sliderImages: string[] = [
    'images/restaurant6.webp',
    'images/restaurant.jpg',
    'images/restaurant4.jpg',
    'images/restaurant7.jpg',
    'images/restaurant9.png',
  ];
  currentSlide = 0;
  private sliderInterval: any;

  // slider 2
  galleryImages: string[] = [
    'images/restaurant5.jpg',
    'images/restaurant8.png',
    'images/restaurant9.png',
    'images/restaurant11.jpg'
  ];
  activeGalleryIndex = 0;

  // products & categories
  allProducts: Product[] = [];
  displayedProducts: Product[] = [];
  categories: Category[] = [];

  filters: ProductFilters = {
    categoryId: 'all',
    spiciness: null,
    nuts: null,
    vegeterian: null
  };

  selectedSpiciness: string = 'null';
  noNuts: boolean = false;
  vegetarianOnly: boolean = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.startAutoSlide();
    this.loadCategories();
    this.loadAllProducts();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  get currentSliderImage(): string {
    return this.sliderImages[this.currentSlide];
  }

  get mainGalleryImage(): string {
    return this.galleryImages[this.activeGalleryIndex];
  }

  startAutoSlide(): void {
    this.sliderInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.sliderImages.length;
    }, 5000);
  }

  stopAutoSlide(): void {
    clearInterval(this.sliderInterval);
  }

  prevSlide(): void {
    this.stopAutoSlide();
    this.currentSlide = (this.currentSlide - 1 + this.sliderImages.length) % this.sliderImages.length;
    this.startAutoSlide();
  }

  nextSlide(): void {
    this.stopAutoSlide();
    this.currentSlide = (this.currentSlide + 1) % this.sliderImages.length;
    this.startAutoSlide();
  }

  showGalleryImage(index: number): void {
    this.activeGalleryIndex = index;
  }

  loadCategories(): void {
    this.productService.getAllCategories().subscribe(categories => {
      this.categories = categories;
      this.cdr.detectChanges();
    });
  }

  loadAllProducts(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.allProducts = products;
      this.displayedProducts = products;
      console.log('Products loaded:', products.length);
      this.cdr.detectChanges();
    });
  }

  selectCategory(categoryId: string | number): void {
    this.filters.categoryId = categoryId;
    
    if (categoryId === 'all') {
      this.displayedProducts = this.allProducts;
    } else {
      this.displayedProducts = this.allProducts.filter(p => p.categoryId == categoryId);
    }
    this.cdr.detectChanges();
  }

  applyFilters(): void {
    this.filters.spiciness = this.selectedSpiciness === 'null' ? null : parseInt(this.selectedSpiciness);
    this.filters.nuts = this.noNuts ? false : null;
    this.filters.vegeterian = this.vegetarianOnly ? true : null;

    const hasApiFilters = this.filters.spiciness !== null || 
                          this.filters.nuts !== null || 
                          this.filters.vegeterian !== null;

    if (!hasApiFilters) {
      if (this.filters.categoryId === 'all') {
        this.displayedProducts = this.allProducts;
      } else {
        this.displayedProducts = this.allProducts.filter(p => p.categoryId == this.filters.categoryId);
      }
      this.cdr.detectChanges();
      return;
    }

    this.productService.getFilteredProducts(this.filters).subscribe(products => {
      if (this.filters.categoryId !== 'all') {
        products = products.filter(p => p.categoryId == this.filters.categoryId);
      }
      this.displayedProducts = products;
      this.cdr.detectChanges();
    });
  }

  resetFilters(): void {
    this.selectedSpiciness = 'null';
    this.noNuts = false;
    this.vegetarianOnly = false;
    this.filters = { 
      categoryId: this.filters.categoryId, 
      spiciness: null, 
      nuts: null, 
      vegeterian: null 
    };
    
    if (this.filters.categoryId === 'all') {
      this.displayedProducts = this.allProducts;
    } else {
      this.displayedProducts = this.allProducts.filter(p => p.categoryId == this.filters.categoryId);
    }
    this.cdr.detectChanges();
  }

addToCart(product: Product): void {
  const isLoggedIn = document.cookie.includes('restaurant_token') ||
                     document.cookie.includes('education_token');

  if (!isLoggedIn) {
    alert('Please login first to add items to cart!');
    return;
  }

  this.cartService.getAll().subscribe(cartItems => {
    const existing = cartItems.find(item => item.product.id === product.id);
    if (existing) {
      this.cartService.updateBasket(product.id, existing.quantity + 1, product.price).subscribe(() => {
        alert('Added to cart ✅');
      });
    } else {
      this.cartService.addToCart(product.id, product.price).subscribe(() => {
        alert('Added to cart ✅');
      });
    }
  });
}
}