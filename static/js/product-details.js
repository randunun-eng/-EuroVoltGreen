// Product Details Modal Handler
document.addEventListener('DOMContentLoaded', function() {

    // Handle all "View Details" button clicks
    document.addEventListener('click', function(e) {
        const button = e.target.closest('.btn');
        if (button && button.textContent.includes('View Details')) {
            // Find product name from the card
            const productCard = button.closest('.product-card');
            if (!productCard) return;

            const productTitle = productCard.querySelector('.card-title, h5');
            if (!productTitle) return;

            const productName = productTitle.textContent.trim();

            // Find product in data
            const product = findProduct(productName);
            if (product) {
                showProductDetails(product);

                // Show the modal
                const modal = new bootstrap.Modal(document.getElementById('productModal'));
                modal.show();
            }
        }
    });

    // Find product in all categories
    function findProduct(name) {
        if (typeof productData === 'undefined') return null;

        for (const category in productData) {
            const products = productData[category];
            const found = products.find(p => p.name === name);
            if (found) return found;
        }
        return null;
    }

    // Show product details in modal
    function showProductDetails(product) {
        // Set modal title
        document.getElementById('productModalTitle').textContent = product.name;

        // Populate overview tab
        populateOverview(product);

        // Populate gallery tab
        populateGallery(product);

        // Populate video tab
        populateVideo(product);

        // Populate specifications tab
        populateSpecifications(product);

        // Populate downloads tab
        populateDownloads(product);
    }

    // Populate Overview Tab
    function populateOverview(product) {
        const content = document.getElementById('overviewContent');

        let html = '<div class="row">';
        html += '<div class="col-md-6">';

        // Product image
        const mainImage = product.images && product.images.length > 0
            ? product.images[0]
            : 'https://pixabay.com/get/g40a3bc7d37cc90e9f39ad90b0c898ba5d38a81fea861f41783b4b0f245bd6cf9317eb79f31800390f287d9bc23f1e486020a7820f46fb7ad94df73be9f291bec_1280.jpg';

        html += `<img src="${mainImage}" class="img-fluid rounded mb-3" alt="${product.name}">`;
        html += '</div>';

        html += '<div class="col-md-6">';
        html += '<h5 class="text-dark mb-3">Key Specifications</h5>';
        html += '<table class="table table-striped">';

        if (product.power) html += `<tr><th class="text-dark">Power</th><td class="text-dark">${product.power}</td></tr>`;
        if (product.current) html += `<tr><th class="text-dark">Current</th><td class="text-dark">${product.current}</td></tr>`;
        if (product.voltage) html += `<tr><th class="text-dark">Voltage</th><td class="text-dark">${product.voltage}</td></tr>`;
        if (product.efficiency) html += `<tr><th class="text-dark">Efficiency</th><td class="text-dark">${product.efficiency}</td></tr>`;
        if (product.mppt_range) html += `<tr><th class="text-dark">MPPT Range</th><td class="text-dark">${product.mppt_range}</td></tr>`;
        if (product.warranty) html += `<tr><th class="text-dark">Warranty</th><td class="text-dark">${product.warranty}</td></tr>`;
        if (product.dimensions) html += `<tr><th class="text-dark">Dimensions</th><td class="text-dark">${product.dimensions}</td></tr>`;
        if (product.weight) html += `<tr><th class="text-dark">Weight</th><td class="text-dark">${product.weight}</td></tr>`;
        if (product.price) html += `<tr><th class="text-dark">Price</th><td class="text-primary fw-bold">${product.price}</td></tr>`;

        html += '</table>';

        // Features
        if (product.features && product.features.length > 0) {
            html += '<h5 class="text-dark mt-4 mb-3">Key Features</h5>';
            html += '<ul class="list-unstyled">';
            product.features.forEach(feature => {
                html += `<li class="text-dark mb-2"><i class="fas fa-check text-success me-2"></i>${feature}</li>`;
            });
            html += '</ul>';
        }

        html += '</div></div>';

        content.innerHTML = html;
    }

    // Populate Gallery Tab
    function populateGallery(product) {
        const content = document.getElementById('galleryContent');

        if (!product.images || product.images.length === 0) {
            content.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted">No images available</p></div>';
            return;
        }

        let html = '';
        product.images.forEach((image, index) => {
            html += '<div class="col-md-4 mb-3">';
            html += `<img src="${image}" class="img-fluid rounded shadow" alt="${product.name} - Image ${index + 1}" style="cursor: pointer;" onclick="openImageLightbox('${image}')">`;
            html += '</div>';
        });

        content.innerHTML = html;
    }

    // Populate Video Tab
    function populateVideo(product) {
        const content = document.getElementById('videoContent');

        if (!product.video) {
            content.innerHTML = '<div class="text-center py-5"><p class="text-muted">No video available</p></div>';
            return;
        }

        const html = `
            <div class="ratio ratio-16x9">
                <iframe src="${product.video}" allowfullscreen></iframe>
            </div>
            <p class="text-dark mt-3">Watch this video to learn more about ${product.name} features and installation.</p>
        `;

        content.innerHTML = html;
    }

    // Populate Specifications Tab
    function populateSpecifications(product) {
        const content = document.getElementById('specsContent');

        if (!product.detailedSpecs) {
            // Show basic specs if detailed specs not available
            let html = '<table class="table table-bordered">';
            html += '<thead class="table-light"><tr><th class="text-dark">Specification</th><th class="text-dark">Value</th></tr></thead>';
            html += '<tbody>';

            if (product.power) html += `<tr><td class="text-dark">Power</td><td class="text-dark">${product.power}</td></tr>`;
            if (product.current) html += `<tr><td class="text-dark">Current</td><td class="text-dark">${product.current}</td></tr>`;
            if (product.voltage) html += `<tr><td class="text-dark">Voltage</td><td class="text-dark">${product.voltage}</td></tr>`;
            if (product.efficiency) html += `<tr><td class="text-dark">Efficiency</td><td class="text-dark">${product.efficiency}</td></tr>`;
            if (product.mppt_range) html += `<tr><td class="text-dark">MPPT Range</td><td class="text-dark">${product.mppt_range}</td></tr>`;
            if (product.warranty) html += `<tr><td class="text-dark">Warranty</td><td class="text-dark">${product.warranty}</td></tr>`;
            if (product.dimensions) html += `<tr><td class="text-dark">Dimensions</td><td class="text-dark">${product.dimensions}</td></tr>`;
            if (product.weight) html += `<tr><td class="text-dark">Weight</td><td class="text-dark">${product.weight}</td></tr>`;

            html += '</tbody></table>';
            content.innerHTML = html;
            return;
        }

        // Show detailed specs
        let html = '';

        for (const category in product.detailedSpecs) {
            html += `<h5 class="text-dark mt-3 mb-3">${category}</h5>`;
            html += '<table class="table table-bordered mb-4">';
            html += '<thead class="table-light"><tr><th class="text-dark">Parameter</th><th class="text-dark">Value</th></tr></thead>';
            html += '<tbody>';

            const specs = product.detailedSpecs[category];
            for (const param in specs) {
                html += `<tr><td class="text-dark">${param}</td><td class="text-dark">${specs[param]}</td></tr>`;
            }

            html += '</tbody></table>';
        }

        // Add certifications if available
        if (product.certifications && product.certifications.length > 0) {
            html += '<h5 class="text-dark mt-4 mb-3">Certifications</h5>';
            html += '<div class="mb-3">';
            product.certifications.forEach(cert => {
                html += `<span class="badge bg-success me-2 mb-2">${cert}</span>`;
            });
            html += '</div>';
        }

        content.innerHTML = html;
    }

    // Populate Downloads Tab
    function populateDownloads(product) {
        const content = document.getElementById('downloadsContent');

        let html = '<div class="row g-3">';

        // Product Catalog
        html += '<div class="col-md-6">';
        html += '<div class="card h-100">';
        html += '<div class="card-body text-center">';
        html += '<i class="fas fa-book fa-3x text-primary mb-3"></i>';
        html += '<h5 class="card-title text-dark">Product Catalog</h5>';
        html += '<p class="card-text text-dark">Download the complete product catalog with detailed information, specifications, and applications.</p>';

        if (product.catalog) {
            html += `<a href="${product.catalog}" class="btn btn-primary" download><i class="fas fa-download me-2"></i>Download Catalog</a>`;
        } else {
            html += '<button class="btn btn-primary" onclick="requestDocument(\'catalog\', \'' + product.name + '\')"><i class="fas fa-envelope me-2"></i>Request Catalog</button>';
        }

        html += '</div></div></div>';

        // Technical Datasheet
        html += '<div class="col-md-6">';
        html += '<div class="card h-100">';
        html += '<div class="card-body text-center">';
        html += '<i class="fas fa-file-pdf fa-3x text-danger mb-3"></i>';
        html += '<h5 class="card-title text-dark">Technical Datasheet</h5>';
        html += '<p class="card-text text-dark">Detailed technical specifications, wiring diagrams, and installation instructions.</p>';

        if (product.datasheet) {
            html += `<a href="${product.datasheet}" class="btn btn-danger" download><i class="fas fa-download me-2"></i>Download Datasheet</a>`;
        } else {
            html += '<button class="btn btn-danger" onclick="requestDocument(\'datasheet\', \'' + product.name + '\')"><i class="fas fa-envelope me-2"></i>Request Datasheet</button>';
        }

        html += '</div></div></div>';

        // Installation Manual
        html += '<div class="col-md-6 mt-3">';
        html += '<div class="card h-100">';
        html += '<div class="card-body text-center">';
        html += '<i class="fas fa-wrench fa-3x text-success mb-3"></i>';
        html += '<h5 class="card-title text-dark">Installation Manual</h5>';
        html += '<p class="card-text text-dark">Step-by-step installation guide with safety precautions and troubleshooting tips.</p>';
        html += '<button class="btn btn-success" onclick="requestDocument(\'manual\', \'' + product.name + '\')"><i class="fas fa-envelope me-2"></i>Request Manual</button>';
        html += '</div></div></div>';

        // User Manual
        html += '<div class="col-md-6 mt-3">';
        html += '<div class="card h-100">';
        html += '<div class="card-body text-center">';
        html += '<i class="fas fa-user-circle fa-3x text-info mb-3"></i>';
        html += '<h5 class="card-title text-dark">User Manual</h5>';
        html += '<p class="card-text text-dark">Complete user guide with operation instructions and maintenance procedures.</p>';
        html += '<button class="btn btn-info" onclick="requestDocument(\'user-manual\', \'' + product.name + '\')"><i class="fas fa-envelope me-2"></i>Request User Manual</button>';
        html += '</div></div></div>';

        html += '</div>';

        // Note about documents
        html += '<div class="alert alert-info mt-4" role="alert">';
        html += '<i class="fas fa-info-circle me-2"></i>';
        html += '<strong>Note:</strong> Some documents require registration. Click "Request" to receive the document via email, or contact our sales team for immediate access.';
        html += '</div>';

        content.innerHTML = html;
    }
});

// Open image in lightbox
function openImageLightbox(imageUrl) {
    const lightbox = document.createElement('div');
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    `;

    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.cssText = 'max-width: 90%; max-height: 90%; object-fit: contain;';

    lightbox.appendChild(img);
    lightbox.onclick = () => lightbox.remove();

    document.body.appendChild(lightbox);
}

// Request document
function requestDocument(docType, productName) {
    alert(`Document request for ${productName} - ${docType}\n\nThis will redirect to the contact form where you can request this document.`);
    window.location.href = 'contact.html?product=' + encodeURIComponent(productName) + '&document=' + encodeURIComponent(docType);
}
