emailjs.init("VRSJUVuGfZDcdN3jR");
document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const contactForm = document.getElementById('contactForm');
    const emailField = document.getElementById('emailField');
    const phoneField = document.getElementById('phoneField');
    const contactTypeRadios = document.querySelectorAll('input[name="contactType"]');
    const successMessage = document.getElementById('successMessage');
    const sendAnotherBtn = document.getElementById('sendAnotherBtn');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    // Toggle between email and phone fields
    contactTypeRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.value === 'email') {
                emailField.classList.remove('hidden');
                phoneField.classList.add('hidden');
                emailInput.setAttribute('required', '');
                phoneInput.removeAttribute('required');
            } else {
                emailField.classList.add('hidden');
                phoneField.classList.remove('hidden');
                phoneInput.setAttribute('required', '');
                emailInput.removeAttribute('required');
            }
        });
    });

    // Form submission handler
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const contactType = formData.get('contactType');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const inquiry = formData.get('inquiry');

        // Validate required fields
        if (!name || !inquiry) {
            alert('Please fill in all required fields');
            return;
        }

        if (contactType === 'email' && !email) {
            alert('Please enter your email address');
            return;
        }

        if (contactType === 'phone' && !phone) {
            alert('Please enter your phone number');
            return;
        }

        // Show loading state
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Prepare email content
        const contactInfo = contactType === 'email' ? `Email: ${email}` : `Phone: ${phone}`;

        emailjs.send("service_26ch4p9", "template_1852mei", {
            name: name,
            contact_info: contactInfo,
            message: inquiry
        }).then(function (response) {
            console.log("SUCCESS", response);
            
            // Hide the header elements
            const header = document.querySelector('header');
            const subtitle = document.querySelector('.subtitle');
            if (header) header.style.display = 'none';
            if (subtitle) subtitle.style.display = 'none';
            
            // Show success message
            contactForm.classList.add('hidden');
            successMessage.classList.remove('hidden');
        }, function (error) {
            console.log("FAILED", error);
            alert("Message failed to send. Please try again later.");
            
            // Reset button state on error
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });

    // "Send Another Message" button handler
    sendAnotherBtn.addEventListener('click', function () {
        // Reset form
        contactForm.reset();

        // Show form, hide success message
        contactForm.classList.remove('hidden');
        successMessage.classList.add('hidden');
        
        // Show the header elements again
        const header = document.querySelector('header');
        const subtitle = document.querySelector('.subtitle');
        if (header) header.style.display = 'block';
        if (subtitle) subtitle.style.display = 'block';

        // Reset to email as default contact method
        emailField.classList.remove('hidden');
        phoneField.classList.add('hidden');
        document.querySelector('input[value="email"]').checked = true;
    });
});