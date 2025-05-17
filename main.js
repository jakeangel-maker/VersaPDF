document.getElementById('convert-btn').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    pdf = new jsPDF('p', 'pt', 'a4'); // 🔹 A4 Portrait Mode
    const images = document.querySelectorAll('#image-preview img');

    if (images.length === 0) {
        alert('Please upload at least one image.');
        return;
    }

    document.getElementById('loading-spinner').style.display = 'block'; // Show loading

    setTimeout(() => {
        images.forEach((img, index) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // ✅ Set canvas size same as image
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            // ✅ Fill canvas with white background (fix transparency issue)
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // ✅ Draw the image over the white background
            ctx.drawImage(img, 0, 0);

            const imgData = canvas.toDataURL('image/jpeg', 1.0);

            // ✅ A4 dimensions in points (1 pt = 1/72 inch)
            const pageWidth = 595.28; // A4 width in points
            const pageHeight = 841.89; // A4 height in points

            // ✅ Calculate new dimensions while keeping aspect ratio
            let imgWidth = pageWidth; // Fit width by default
            let imgHeight = (img.naturalHeight / img.naturalWidth) * pageWidth;

            if (imgHeight > pageHeight) {
                imgHeight = pageHeight; // Fit height instead
                imgWidth = (img.naturalWidth / img.naturalHeight) * pageHeight;
            }

            // ✅ Centering the image
            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;

            if (index > 0) {
                pdf.addPage(); // Add new page for each image
            }

            pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
        });

        document.getElementById('loading-spinner').style.display = 'none'; // Hide loading
        document.getElementById('download-btn').style.display = 'block'; // Show download button
    }, 2000);
});

document.getElementById('download-btn').addEventListener('click', function() {
    if (pdf) {
        pdf.save('converted.pdf');
    } else {
        alert('Please convert images to PDF first.');
    }
});
// ✅ Toggle account popup
document.getElementById('account-btn').addEventListener('click', function(event) {
    let popup = document.getElementById('account-popup');
    
    // Prevent default closing when clicking the button
    event.stopPropagation();

    // ✅ Toggle visibility
    popup.classList.toggle('show');
});

// ✅ Close popup when clicking outside
document.addEventListener('click', function(event) {
    let popup = document.getElementById('account-popup');
    let button = document.getElementById('account-btn');

    if (!button.contains(event.target) && !popup.contains(event.target)) {
        popup.classList.remove('show');
    }
});


document.getElementById("login-btn").addEventListener("click", function() {
    window.location.href = "login.html";
});

document.addEventListener("DOMContentLoaded", async () => {
    if (typeof supabase === "undefined") {
        console.error("Supabase is not initialized properly!");
        return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        const userName = user.user_metadata?.full_name || "User";
        const userImage = user.user_metadata?.avatar_url || "https://i.postimg.cc/VvwnKx7X/profile-8861091.png";

        console.log("User Data:", user); // ✅ Debugging log to check user data

        // ✅ Update account button (navbar)
        const accountBtnName = document.getElementById("account-btn-name");
        const accountBtnImg = document.getElementById("account-btn-img");

        if (accountBtnName) accountBtnName.innerText = userName;  // Update text
        if (accountBtnImg) {
            accountBtnImg.src = userImage;
            accountBtnImg.style.display = "block"; // Show image
        }

        // ✅ Update popup profile section
        const popupUserName = document.getElementById("popup-user-name");
        const popupUserImage = document.getElementById("popup-user-image");

        if (popupUserName) popupUserName.innerText = userName;
        if (popupUserImage) popupUserImage.src = userImage;

        // ✅ Show logout button & hide login button after login
        document.getElementById("login-btn").style.display = "none";
        document.getElementById("logout-btn").style.display = "block";
    } else {
        // If user is not logged in, show login button & hide logout button
        document.getElementById("login-btn").style.display = "block";
        document.getElementById("logout-btn").style.display = "none";
    }

    // ✅ Logout functionality
    document.getElementById("logout-btn").addEventListener("click", async () => {
        await supabase.auth.signOut();
        window.location.reload(); // Refresh the page after logout
     const faders = document.querySelectorAll('.fade-in');

  window.addEventListener('scroll', () => {
    faders.forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight - 100; // starts fading in ~100px before entering view
      if (isVisible) {
        el.classList.add('visible');
      }
    });
  });
        
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const uploadArea = document.querySelector('.upload-area');
    const fileInput = document.getElementById('file-input');
    const imagePreview = document.getElementById('image-preview');
    const uploadBtn = document.querySelector('.btn-primary'); // Fix: Target the button correctly

    if (!uploadArea || !fileInput || !imagePreview || !uploadBtn) {
        console.error("One or more elements not found!");
        return;
    }

    // Store uploaded files to prevent duplicates
    let uploadedFiles = new Set();

    // ✅ Fix: Prevents duplicate uploads
    uploadBtn.addEventListener('click', function () {
        fileInput.value = ''; // Clear input before opening (fixes duplicate issue)
        fileInput.click(); 
    });

    // ✅ Fix: Remove old function that added images without the '✖' button
    fileInput.addEventListener('change', (event) => {
        event.preventDefault();
        handleFiles([...event.target.files]); 
    });

    // Drag and Drop Functionality
    uploadArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        uploadArea.style.border = '2px dashed #b7834c';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.border = '2px dashed #E0E0E0';
    });

    uploadArea.addEventListener('drop', (event) => {
        event.preventDefault();
        uploadArea.style.border = '2px dashed #E0E0E0';
        handleFiles([...event.dataTransfer.files]); 
    });

    // Function to handle file uploads (avoiding duplicates)
    function handleFiles(files) {
        files.forEach((file) => {
            if (file.type.startsWith('image/') && !uploadedFiles.has(file.name)) {
                uploadedFiles.add(file.name); 

                const reader = new FileReader();
                reader.onload = (e) => {
                    const imgContainer = document.createElement('div');
                    imgContainer.style.position = 'relative';
                    imgContainer.style.display = 'inline-block';
                    imgContainer.style.margin = '5px';

                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.width = '100px';
                    img.style.height = '100px';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '8px';
                    img.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';

                    // Modern Remove button
                    const removeBtn = document.createElement('button');
                    removeBtn.innerHTML = '✖';
                    removeBtn.style.position = 'absolute';
                    removeBtn.style.top = '5px';
                    removeBtn.style.right = '5px';
                    removeBtn.style.background = 'rgba(0, 0, 0, 0.7)';
                    removeBtn.style.color = 'white';
                    removeBtn.style.border = 'none';
                    removeBtn.style.borderRadius = '50%';
                    removeBtn.style.width = '24px';
                    removeBtn.style.height = '24px';
                    removeBtn.style.cursor = 'pointer';
                    removeBtn.style.fontSize = '14px';
                    removeBtn.style.display = 'flex';
                    removeBtn.style.alignItems = 'center';
                    removeBtn.style.justifyContent = 'center';
                    removeBtn.style.transition = '0.2s ease-in-out';
                    removeBtn.style.opacity = '0.8';

                    removeBtn.addEventListener('mouseover', () => {
                        removeBtn.style.opacity = '1';
                        removeBtn.style.transform = 'scale(1.1)';
                    });

                    removeBtn.addEventListener('mouseout', () => {
                        removeBtn.style.opacity = '0.8';
                        removeBtn.style.transform = 'scale(1)';
                    });

                    removeBtn.addEventListener('click', () => {
                        imagePreview.removeChild(imgContainer);
                        uploadedFiles.delete(file.name); 
                    });

                    imgContainer.appendChild(img);
                    imgContainer.appendChild(removeBtn);
                    imagePreview.appendChild(imgContainer);
                };

                reader.readAsDataURL(file);
            }
        });
    }
});
