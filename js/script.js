// js/navbar-loader.js
class NavbarLoader {
    constructor() {
        this.navbarContainerId = 'navbar-container';
        this.currentPage = this.getCurrentPage();
        this.basePath = this.calculateBasePath();
    }

    // Deteksi halaman saat ini - DIPERBARUI
    getCurrentPage() {
        const path = window.location.pathname;
        
        // Deteksi halaman paket spesifik
        if (path.includes('bedugul')) return 'bedugul';
        if (path.includes('ubud')) return 'ubud';
        if (path.includes('kintamani')) return 'kintamani';
        if (path.includes('tanah-lot')) return 'tanah-lot';
        
        // Deteksi halaman umum
        if (path.includes('galeri')) return 'galeri';
        if (path.includes('paket')) return 'paket';
        if (path.includes('booking')) return 'booking';
        return 'home';
    }

    // Hitung base path berdasarkan lokasi file - DIPERBARUI
    calculateBasePath() {
        const path = window.location.pathname;
        
        // Jika di folder paket (untuk bedugul.html, ubud.html, dll)
        if (path.includes('/paket/')) {
            return '../';
        }
        // Jika di folder galeri, booking, dll
        if (path.includes('/galeri/') || path.includes('/booking/')) {
            return '../';
        }
        // Jika di root
        return './';
    }

    // Load navbar
    async loadNavbar() {
        try {
            const response = await fetch(`${this.basePath}components/navbar.html`);
            let navbarHtml = await response.text();
            
            // Replace base path placeholder
            navbarHtml = navbarHtml.replace(/\[\[BASE_PATH\]\]/g, this.basePath);
            
            // Inject navbar ke container
            const container = document.getElementById(this.navbarContainerId);
            if (container) {
                container.innerHTML = navbarHtml;
                this.setActivePage();
                this.initializeMobileMenu();
            }
        } catch (error) {
            console.error('Error loading navbar:', error);
        }
    }

    // Set halaman aktif
    setActivePage() {
        const activeClass = 'text-[#005f73] bg-[#f0f8ff]';
        
        // Reset semua menu
        document.querySelectorAll('[class*="nav-"]').forEach(item => {
            item.classList.remove('text-[#005f73]', 'bg-[#f0f8ff]');
            item.classList.add('text-gray-700');
        });

        // Set menu aktif berdasarkan halaman saat ini
        const activeElement = document.querySelector(`.nav-${this.currentPage}`);
        if (activeElement) {
            activeElement.classList.remove('text-gray-700');
            activeElement.classList.add('text-[#005f73]', 'bg-[#f0f8ff]');
        }
    }

    // Initialize mobile menu functionality
    initializeMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });

            // Close mobile menu ketika klik di luar
            document.addEventListener('click', (e) => {
                if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenu.classList.add('hidden');
                }
            });
        }
    }
}

// Auto-initialize ketika DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    const navbarLoader = new NavbarLoader();
    navbarLoader.loadNavbar();
});