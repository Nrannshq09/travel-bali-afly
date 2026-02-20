
        // Navigation
        function toggleMenu() {
            const menu = document.getElementById('navMenu');
            menu.classList.toggle('active');
        }

        function showSection(sectionId) {
            // Hide all sections
            const sections = ['home', 'destinasi', 'paket', 'booking', 'tentang'];
            sections.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.classList.add('hidden');
                }
            });

            // Show selected section
            const selectedSection = document.getElementById(sectionId);
            if (selectedSection) {
                selectedSection.classList.remove('hidden');
            }

            // Close mobile menu
            const menu = document.getElementById('navMenu');
            menu.classList.remove('active');

            // Scroll to top
            window.scrollTo(0, 0);
        }

        function selectPackage(packageName) {
            document.getElementById('package').value = packageName;
            showSection('booking');
        }

        function sendWhatsApp() {
            const name = document.getElementById('name').value;
            const date = document.getElementById('date').value;
            const guests = document.getElementById('guests').value;
            const packageSelected = document.getElementById('package').value;
            const contact = document.getElementById('contact').value;

            if (!name || !date || !guests || !packageSelected || !contact) {
                alert('Mohon lengkapi semua field!');
                return;
            }

            const message = `Halo, saya ingin booking tour:%0A%0ANama: ${name}%0ATanggal: ${date}%0AJumlah Orang: ${guests}%0APaket: ${packageSelected}%0AKontak: ${contact}`;
            
            // Ganti nomor WhatsApp sesuai nomor papa Anda
            window.open(`https://wa.me/6282144094585?text=${message}`, '_blank');
        }

        // Show home section by default
        window.onload = function() {
            showSection('home');
        };
   


// Smooth scroll animation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
