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
    this.router.navigate([tile.route]);
  }

  onLogout(): void {
    this.vendorService.logout();
    this.router.navigate(['/vendor/login']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/vendor/profile']);
  }
}
