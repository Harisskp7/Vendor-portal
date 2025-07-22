import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { DashboardTile, VendorProfile } from '../vendor.model'; // ✅ Import VendorProfile

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})
export class VendorDashboardComponent implements OnInit {
  tiles: DashboardTile[] = [];
  isLoading = true;
  vendorId: string | null = null;
  vendorName: string = ''; // ✅ Add vendor name
  showFinanceMenu = false; // Add this property
  showFinancePage = false; // Add this property to show Finance sub-items
  financeTiles: DashboardTile[] = []; // Add Finance sub-tiles

  constructor(
    private vendorService: VendorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vendorId = this.vendorService.getCurrentVendorId();

    if (!this.vendorId) {
      console.warn('No vendor ID found, redirecting to login.');
      this.router.navigate(['/vendor/login']);
      return;
    }

    this.loadVendorProfile(); // ✅ Load name
    this.loadDashboardTiles();
    this.initializeFinanceTiles(); // Initialize Finance sub-tiles
  }

  // ✅ Fetch the vendor's name
loadVendorProfile(): void {
  if (!this.vendorId) return;

  this.vendorService.getVendorProfile(this.vendorId).subscribe({
    next: (profile: VendorProfile) => {
      this.vendorName = profile.Name1 || 'Vendor';
    },
    error: (error) => {
      console.error('Error loading vendor profile:', error);
    }
  });
}

  initializeFinanceTiles(): void {
    this.financeTiles = [
      {
        title: 'Invoice',
        count: 15,
        route: '/vendor/inv',
        color: '#8b5cf6'
      },
      {
        title: 'Memo',
        count: 15,
        route: '/vendor/memo',
        color: '#8b5cf6'
      },
      {
        title: 'Pay',
        count: 15,
        route: '/vendor/pay',
        color: '#8b5cf6'
      }
    ];
  }

  loadDashboardTiles(): void {
    this.vendorService.getDashboardTiles().subscribe({
      next: (tiles) => {
        this.tiles = tiles;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard tiles:', error);
        this.isLoading = false;
      }
    });
  }

  onTileClick(tile: DashboardTile): void {
    if (tile.title === 'Finance') {
      this.showFinancePage = true;
    } else {
      this.router.navigate([tile.route]);
    }
  }

  onLogout(): void {
    this.vendorService.logout();
    this.router.navigate(['/vendor/login']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/vendor/profile']);
  }

  navigateTo(route: string): void {
    this.router.navigate([`/vendor/${route}`]);
  }

  toggleFinanceMenu(): void {
    this.showFinanceMenu = !this.showFinanceMenu;
  }

  goBackToMain(): void {
    this.showFinancePage = false;
  }

  getTileIcon(title: string): string {
    switch (title) {
      case 'Request for Quotation':
        return 'fas fa-file-alt';
      case 'Purchase Orders':
        return 'fas fa-shopping-cart';
      case 'Goods Receipt':
        return 'fas fa-truck';
      case 'Finance':
        return 'fas fa-chart-line';
      case 'Invoice':
        return 'fas fa-receipt';
      case 'Memo':
        return 'fas fa-sticky-note';
      case 'Pay':
        return 'fas fa-credit-card';
      default:
        return 'fas fa-cube';
    }
  }
}
