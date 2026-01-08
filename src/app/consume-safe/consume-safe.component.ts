import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import boycottData from '../data/boycotted-products.json';

interface BoycottedProduct {
  name: string;
  reason: string;
  alternatives: string[];
}

@Component({
  selector: 'app-consume-safe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consume-safe.component.html',
  styleUrls: ['./consume-safe.component.scss']
})
export class ConsumeSafeComponent {
  productName: string = '';
  searchResult: {
    found: boolean;
    product?: BoycottedProduct;
    message: string;
  } | null = null;

  searchProduct(): void {
    if (!this.productName.trim()) {
      return;
    }

    const found = boycottData.boycottedProducts.find(
      p => p.name.toLowerCase() === this.productName.toLowerCase()
    );

    if (found) {
      this.searchResult = {
        found: true,
        product: found,
        message: `⚠️ This product is BOYCOTTED! ${found.reason}`
      };
    } else {
      this.searchResult = {
        found: false,
        message: '✓ You can use this product - not on boycott list'
      };
    }
  }
}