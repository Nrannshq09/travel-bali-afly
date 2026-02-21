class NavbarLoader {
    constructor() {
        this.navbarContainerId = 'navbar-container';
        this.currentPage = this.getCurrentPage();
        this.basePath = this.calculateBasePath();
    }

    // Deteksi halaman saat ini
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('galeri')) return 'galeri';
        if (path.includes('paket')) return 'paket';
        if (path.includes('booking')) return 'booking';
        return 'home';
    }

    // Hitung base path berdasarkan lokasi file - DIPERBAIKI
    calculateBasePath() {
        const path = window.location.pathname;
        console.log('Current path:', path); // Debug
        
        if (path.includes('/galeri/') || path.includes('/paket/') || path.includes('/booking/')) {
            return '../';
        }
        return './';
    }

    // Load navbar
    async loadNavbar() {
        try {
            const navbarPath = `${this.basePath}components/navbar.html`;
            console.log('Loading navbar from:', navbarPath); // Debug
            
            const response = await fetch(navbarPath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            let navbarHtml = await response.text();
            
            // Replace base path placeholder
            navbarHtml = navbarHtml.replace(/\[\[BASE_PATH\]\]/g, this.basePath);
            
            // Inject navbar ke container
            const container = document.getElementById(this.navbarContainerId);
            if (container) {
                container.innerHTML = navbarHtml;
                this.setActivePage();
                this.initializeMobileMenu();
                console.log('Navbar loaded successfully'); // Debug
            } else {
                console.error('Navbar container not found');
            }
        } catch (error) {
            console.error('Error loading navbar:', error);
            // Fallback: tampilkan navbar sederhana
            this.showFallbackNavbar();
        }
    }

    // Fallback navbar jika loading gagal
    showFallbackNavbar() {
        const container = document.getElementById(this.navbarContainerId);
        if (container) {
            container.innerHTML = `
                <nav class="bg-white shadow-lg fixed w-full z-50">
                    <div class="container mx-auto px-6 py-4">
                        <a href="${this.basePath}index.html" class="text-2xl font-bold text-[#005f73]">Afly Bali Explore</a>
                    </div>
                </nav>
            `;
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

        // Set menu aktif
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
            mobileMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileMenu.classList.toggle('hidden');
            });

            // Close mobile menu ketika klik di luar
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
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