 // API Configuration (gunakan localStorage untuk demo, bisa diganti dengan backend)
  const API = {
    // Method untuk menyimpan review
    saveReview: function(review) {
      let reviews = JSON.parse(localStorage.getItem('tourReviews')) || [];
      
      // Tambahkan ID dan timestamp
      review.id = Date.now();
      review.date = new Date().toISOString();
      review.photo = review.photo || [];
      
      reviews.unshift(review); // Tambahkan di awal array
      localStorage.setItem('tourReviews', JSON.stringify(reviews));
      
      // Update statistik
      this.updateStats();
      
      return review;
    },
    
    // Method untuk mengambil semua review
    getReviews: function(limit = 6, offset = 0) {
      const reviews = JSON.parse(localStorage.getItem('tourReviews')) || [];
      return {
        total: reviews.length,
        data: reviews.slice(offset, offset + limit)
      };
    },
    
    // Method untuk menghitung statistik rating
    getStats: function() {
      const reviews = JSON.parse(localStorage.getItem('tourReviews')) || [];
      
      if (reviews.length === 0) {
        // Data default jika belum ada review
        return {
          average: 4.8,
          total: 156,
          distribution: {
            5: 117,
            4: 23,
            3: 9,
            2: 4,
            1: 3
          }
        };
      }
      
      let total = 0;
      let distribution = {5:0, 4:0, 3:0, 2:0, 1:0};
      
      reviews.forEach(review => {
        const rating = parseInt(review.rating) || 0;
        if (rating >= 1 && rating <= 5) {
          distribution[rating]++;
          total += rating;
        }
      });
      
      const average = reviews.length > 0 ? (total / reviews.length).toFixed(1) : 0;
      
      return {
        average: parseFloat(average),
        total: reviews.length,
        distribution: distribution
      };
    },
    
    // Update statistik di UI
    updateStats: function() {
      const stats = this.getStats();
      const dist = stats.distribution;
      const total = stats.total;
      
      // Update average rating
      document.getElementById('avgRating').textContent = stats.average;
      
      // Update star display
      const avgStars = document.getElementById('avgStars');
      avgStars.innerHTML = '';
      const fullStars = Math.floor(stats.average);
      const halfStar = stats.average % 1 >= 0.5;
      
      for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
          avgStars.innerHTML += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && halfStar) {
          avgStars.innerHTML += '<i class="fas fa-star-half-alt"></i>';
        } else {
          avgStars.innerHTML += '<i class="far fa-star"></i>';
        }
      }
      
      // Update total reviews
      document.getElementById('totalReviews').textContent = `Berdasarkan ${total} ulasan`;
      
      // Update distribution bars
      for (let i = 1; i <= 5; i++) {
        const percentage = total > 0 ? (dist[i] / total * 100) : 0;
        document.getElementById(`rating${i}`).style.width = percentage + '%';
        document.getElementById(`rating${i}Count`).textContent = dist[i];
      }
    }
  };

  // Inisialisasi data default jika belum ada
  if (!localStorage.getItem('tourReviews')) {
    const defaultReviews = [
      {
        id: 1,
        name: "Sarah Johnson",
        rating: 5,
        package: "Ubud & Tanah Lot Tour",
        text: "Paket petualangan Bali benar-benar luar biasa! Pemandu kami sangat ramah dan berpengalaman. Rafting di Sungai Ayung adalah pengalaman yang tak terlupakan.",
        date: "2025-02-15T10:30:00.000Z",
        photo: []
      },
      {
        id: 2,
        name: "Ahmad Rizki",
        rating: 4.5,
        package: "Nusa Dua & Uluwatu Temple",
        text: "Paket budaya Ubud sangat informatif. Kami belajar banyak tentang seni dan tradisi Bali. Pemandu sangat berpengetahuan dan sabar menjawab semua pertanyaan kami.",
        date: "2025-02-10T08:45:00.000Z",
        photo: []
      },
      {
        id: 3,
        name: "Maria Garcia",
        rating: 5,
        package: "Nusa Penida Island Tour",
        text: "Paket luxury Nusa Dua worth every penny! Akomodasi mewah, makanan lezat, dan layanan yang sangat personal. Pasti akan kembali lagi dengan Afly Bali Tour.",
        date: "2025-02-05T14:20:00.000Z",
        photo: []
      }
    ];
    localStorage.setItem('tourReviews', JSON.stringify(defaultReviews));
  }

  // Rating Stars Interaction
  document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('#ratingStars i');
    const ratingInput = document.getElementById('ratingValue');
    
    stars.forEach(star => {
      star.addEventListener('mouseover', function() {
        const rating = parseInt(this.dataset.rating);
        highlightStars(rating);
      });
      
      star.addEventListener('mouseout', function() {
        const currentRating = parseInt(ratingInput.value);
        highlightStars(currentRating);
      });
      
      star.addEventListener('click', function() {
        const rating = parseInt(this.dataset.rating);
        ratingInput.value = rating;
        highlightStars(rating);
      });
    });
    
    function highlightStars(rating) {
      stars.forEach((star, index) => {
        if (index < rating) {
          star.className = 'fas fa-star text-yellow-400 cursor-pointer transition';
        } else {
          star.className = 'far fa-star cursor-pointer hover:text-yellow-400 transition';
        }
      });
    }
    
    // Photo Upload
    const dropZone = document.getElementById('dropZone');
    const photoInput = document.getElementById('photoUpload');
    const photoPreview = document.getElementById('photoPreview');
    
    dropZone.addEventListener('click', () => photoInput.click());
    
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('border-[#005f73]', 'bg-blue-50');
    });
    
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('border-[#005f73]', 'bg-blue-50');
    });
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-[#005f73]', 'bg-blue-50');
      const files = e.dataTransfer.files;
      handlePhotoUpload(files);
    });
    
    photoInput.addEventListener('change', (e) => {
      handlePhotoUpload(e.target.files);
    });
    
    function handlePhotoUpload(files) {
      photoPreview.innerHTML = '';
      Array.from(files).slice(0, 5).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'w-20 h-20 object-cover rounded-lg';
            photoPreview.appendChild(img);
          };
          reader.readAsDataURL(file);
        }
      });
    }
    
    // Form Submission
    const ratingForm = document.getElementById('ratingForm');
    
    ratingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('reviewerName').value;
      const email = document.getElementById('reviewerEmail').value;
      const tourPackage = document.getElementById('tourPackage').value;
      const rating = document.getElementById('ratingValue').value;
      const reviewText = document.getElementById('reviewText').value;
      
      if (!rating || rating === '0') {
        alert('Silakan pilih rating');
        return;
      }
      
      // Simpan review
      const newReview = {
        name: name,
        email: email,
        package: tourPackage,
        rating: parseFloat(rating),
        text: reviewText,
        photo: [] // Di sini bisa ditambahkan logika upload ke server
      };
      
      API.saveReview(newReview);
      
      // Reset form
      ratingForm.reset();
      document.getElementById('ratingValue').value = '0';
      highlightStars(0);
      photoPreview.innerHTML = '';
      
      // Update UI
      loadTestimonials();
      API.updateStats();
      
      alert('Terima kasih! Pengalaman Anda telah dibagikan.');
    });
    
    // Load Testimonials Function
    function loadTestimonials(offset = 0) {
      const { data: reviews } = API.getReviews(6, offset);
      const testimoniGrid = document.getElementById('testimoniGrid');
      
      if (offset === 0) {
        testimoniGrid.innerHTML = '';
      }
      
      reviews.forEach(review => {
        const stars = getStarHTML(review.rating);
        
        const card = `
          <div class="bg-white rounded-2xl shadow-lg p-6 fade-in hover:shadow-xl transition">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-[#005f73] to-[#0077b6] rounded-full flex items-center justify-center text-white font-bold mr-4">
                ${review.name.charAt(0)}
              </div>
              <div>
                <h4 class="font-bold text-[#005f73]">${review.name}</h4>
                <div class="flex text-yellow-400 text-sm">
                  ${stars}
                </div>
              </div>
            </div>
            <p class="text-gray-600 mb-2 line-clamp-3">"${review.text}"</p>
            <div class="flex justify-between items-center text-sm text-gray-500">
              <span><i class="fas fa-box mr-1 text-[#005f73]"></i>${review.package}</span>
              <span>${new Date(review.date).toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        `;
        
        testimoniGrid.innerHTML += card;
      });
      
      // Update recent reviews
      const recentReviews = document.getElementById('recentReviews');
      recentReviews.innerHTML = '';
      reviews.slice(0, 3).forEach(review => {
        const stars = getStarHTML(review.rating);
        recentReviews.innerHTML += `
          <div class="border-b border-gray-200 pb-3 last:border-0">
            <div class="flex justify-between items-start">
              <span class="font-semibold text-sm">${review.name}</span>
              <div class="flex text-yellow-400 text-xs">${stars}</div>
            </div>
            <p class="text-xs text-gray-600 mt-1 line-clamp-2">"${review.text.substring(0, 60)}..."</p>
          </div>
        `;
      });
    }
    
    function getStarHTML(rating) {
      let stars = '';
      const fullStars = Math.floor(rating);
      const halfStar = rating % 1 >= 0.5;
      
      for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
          stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && halfStar) {
          stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
          stars += '<i class="far fa-star"></i>';
        }
      }
      return stars;
    }
    
    // Load More functionality
    let currentOffset = 6;
    document.getElementById('loadMoreBtn').addEventListener('click', function() {
      loadTestimonials(currentOffset);
      currentOffset += 6;
      
      // Hide button if no more reviews
      const { total } = API.getReviews();
      if (currentOffset >= total) {
        this.style.display = 'none';
      }
    });
    
    // Initial load
    API.updateStats();
    loadTestimonials(0);
  });