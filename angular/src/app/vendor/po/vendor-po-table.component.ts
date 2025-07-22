import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { PO } from '../vendor.model';

@Component({
  selector: 'app-vendor-po',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-po-table.component.html',
  styleUrls: ['./vendor-po-table.component.css']
})
export class VendorpoComponent implements OnInit {
  pos: PO[] = [];
  isLoading = true;
  vendorId: string | null = null;

  constructor(
    private vendorService: VendorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vendorId = this.vendorService.getCurrentVendorId();
    if (!this.vendorId) {
      this.router.navigate(['/vendor/login']);
      return;
    }
    this.loadPOs();
  }

  loadPOs(): void {
    if (!this.vendorId) return;
    
    this.isLoading = true;
    this.vendorService.getVendorPO(this.vendorId).subscribe({
      next: (pos) => {
        this.pos = pos;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading POs:', error);
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    // Handle OData date format (e.g., "/Date(1234567890000)/")
    if (dateString.includes('/Date(')) {
      const timestamp = parseInt(dateString.replace(/[^0-9]/g, ''), 10);
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    // Handle regular date strings
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString; // Return original if parsing fails
    }
  }

  goBack(): void {
    this.router.navigate(['/vendor/dashboard']);
  }
}
