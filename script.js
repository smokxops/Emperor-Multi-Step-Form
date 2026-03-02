// Emperors Multi Step Form JavaScript
// State Management & Form Handling

// Global State
const formState = {
    currentStep: 1,
    billing: 'monthly',
    selectedPlan: null,
    addOns: [],
    personalInfo: {
        fullName: '',
        email: '',
        phone: ''
    }
};

// Pricing Data
const pricing = {
    plans: {
        basic: { monthly: 9, yearly: 72 },
        pro: { monthly: 19, yearly: 152 },
        enterprise: { monthly: 39, yearly: 312 }
    },
    addons: {
        'online-service': { monthly: 1, yearly: 10 },
        'larger-storage': { monthly: 2, yearly: 20 },
        'customizable-profile': { monthly: 2, yearly: 20 }
    }
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('Emperors Multi Step Form Initialized');

    // Set up billing toggle
    setupBillingToggle();

    // Set up plan selection
    setupPlanSelection();

    // Set up add-on checkboxes
    setupAddonCheckboxes();

    // Set up form inputs
    setupFormInputs();

    // Update progress
    updateProgress();
});

// Billing Toggle
function setupBillingToggle() {
    const billingInputs = document.querySelectorAll('input[name="billing"]');

    billingInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            formState.billing = e.target.value;
            updatePricing();
            console.log('Billing updated to:', formState.billing);
        });
    });
}

function updatePricing() {
    const isYearly = formState.billing === 'yearly';

    // Update plan prices
    document.querySelectorAll('.plan-card').forEach(card => {
        const planType = card.dataset.plan;
        const priceElement = card.querySelector('.price-amount');
        const price = isYearly
            ? pricing.plans[planType].yearly
            : pricing.plans[planType].monthly;

        priceElement.textContent = `$${price}`;

        // Update period text
        const periodElement = card.querySelector('.price-period');
        periodElement.textContent = isYearly ? '/yr' : '/mo';
    });

    // Update add-on prices
    document.querySelectorAll('.addon-card').forEach(addon => {
        const checkbox = addon.querySelector('input[type="checkbox"]');
        const addonValue = checkbox.value;
        const priceElement = addon.querySelector('.addon-price');
        const price = isYearly
            ? pricing.addons[addonValue].yearly
            : pricing.addons[addonValue].monthly;

        priceElement.textContent = isYearly ? `+$${price}/yr` : `+$${price}/mo`;
    });
}

// Plan Selection
function setupPlanSelection() {
    const planCards = document.querySelectorAll('.plan-card');

    planCards.forEach(card => {
        const selectBtn = card.querySelector('.plan-select-btn');

        selectBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            // Remove previous selection
            planCards.forEach(c => c.classList.remove('selected'));

            // Add new selection
            card.classList.add('selected');
            formState.selectedPlan = card.dataset.plan;

            console.log('Plan selected:', formState.selectedPlan);

            // Clear error if exists
            document.getElementById('step1Error').classList.remove('show');
        });
    });
}

// Addon Selection
function setupAddonCheckboxes() {
    const addonCheckboxes = document.querySelectorAll('.addon-card input[type="checkbox"]');

    addonCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateAddons();
        });
    });
}

function updateAddons() {
    const checkedAddons = document.querySelectorAll('.addon-card input[type="checkbox"]:checked');
    formState.addons = Array.from(checkedAddons).map(checkbox => ({
        name: checkbox.value,
        priceMonthly: parseFloat(checkbox.dataset.priceMonthly),
        priceYearly: parseFloat(checkbox.dataset.priceYearly)

    }));

    console.log('Add-ons updated:', formState.addons);
}

// Form Inputs
function setupFormInputs() {
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    nameInput.addEventListener('input', (e) => {
        formState.personalInfo.fullName = e.target.value;
        clearFieldError('nameError');
        e.target.classList.remove('error');
    });

    emailInput.addEventListener('input', (e) => {
        formState.personalInfo.email = e.target.value;
        clearFieldError('emailError');
        e.target.classList.remove('error');
    });

    phoneInput.addEventListener('input', (e) => {
        formState.personalInfo.phone = e.target.value;
        clearFieldError('phoneError');
        e.target.classList.remove('error');
    });
}

// Validation
function validateStep(step) {
    switch(step) {
        case 1:
            return validateStep1();
        case 2:
            return true; // No required fields in step 2
        case 3:
            return validateStep3();
        default:
            return true;
    }
}

function validateStep1() {
    if (!formState.selectedPlan) {
        showError('step1Error', 'Please select a plan to continue...');
        return false;
    }
    return true;
}

function validateStep3() {
    let isValid = true;

    // Validate name
    if (!formState.personalInfo.fullName.trim()) {
        showFieldError('nameError', 'Full Name is required');
        document.getElementById('fullName').classList.add('error');
        isValid = false;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formState.personalInfo.email.trim()) {
        showFieldError('emailError', 'Email is required');
        document.getElementById('email').classList.add('error');
        isValid = false;
    } else if (!emailPattern.test(formState.personalInfo.email)) {
        showFieldError('emailError', 'Please enter a valid email address');
        document.getElementById('email').classList.add('error');
        isValid = false;
    }

    // Validate phone
    const phonePattern = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    if (!formState.personalInfo.phone.trim()) {
        showFieldError('phoneError', 'Phone number is required');
        document.getElementById('phone').classList.add('error');
        isValid = false;
    } else if (!phonePattern.test(formState.personalInfo.phone.replace(/\s/g, ''))) {
        showFieldError('phoneError', 'Please enter a valid phone number');
        document.getElementById('phone').classList.add('error');
        isValid = false;
    }

    return isValid;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function showFieldError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearFieldError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.classList.remove('show');
}

// Navigation
function nextStep() {
    // Validate current step before moving to next
    if (!validateStep(formState.currentStep)) {
        console.log('Validation failed for step', formState.currentStep);
        return;
    }

    // Move to next step
    if (formState.currentStep < 4) {
        formState.currentStep++;
        showStep(formState.currentStep);

        // Update summary if moving to step 4
        if (formState.currentStep === 4) {
            updateSummary();
        }

        console.log('Moved to step', formState.currentStep);
    }
}

function previousStep() {
    if (formState.currentStep > 1) {
        formState.currentStep--;
        showStep(formState.currentStep);
        console.log('Moved back to step', formState.currentStep);
    }
}

function goToStep(step) {
    formState.currentStep = step;
    showStep(step);
    console.log('Jumped to step', step);
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(s => {
        s.classList.remove('active');
    });

    // Show current step
    const currentStep = document.querySelector('.form-step[data-step="${step}"]');
    if (currentStep) {
        currentStep.classList.add('active');
    }

    // Update progress
    updateProgress();

    // Update step indicators
    updateStepIndicators();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const percentage = (formState.currentStep / 4) * 100;
    progressFill.style.width = `${percentage}%`;
}

function updateStepIndicators() {
    const indicators = document.querySelectorAll('.step-indicator');

    indicators.forEach((indicator, index) => {
        const stepNumber = index + 1;

        indicator.classList.remove('active', 'completed');

        if (stepNumber === formState.currentStep) {
            indicator.classList.add('active');
        } else if (stepNumber < formState.currentStep) {
            indicator.classList.add('completed');
        }
    });
}

// Summary
function updateSummary() {
    const isYearly = formState.billing === 'yearly';
    const planName = formState.selectedPlan.charAt(0).toUpperCase() + formState.selectedPlan.slice(1);
    const billingText = isYearly ? 'Yearly' : 'Monthly';

    // Update plan name
    document.getElementById('summaryPlanName').textContent = `${planName} (${billingText})`;

    // Update plan price
    const planPrice = isYearly
        ? pricing.plans[formState.selectedPlan].yearly
        : pricing.plans[formState.selectedPlan].monthly;

    document.getElementById('summaryPlanPrice').textContent = isYearly
        ? `$${planPrice}/yr`
        : `$${planPrice}/mo`;

    // Update add-ons
    const addonsContainer = document.getElementById('summaryAddons');
    addonsContainer.innerHTML = '';

    if (formState.addons.length > 0) {
        formState.addons.forEach(addon => {
            const addonPrice = isYearly ? addon.priceYearly : addon.priceMonthly;
            const addonName = addon.name.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');

            const addonElement = document.createElement('div');
            addonElement.className = 'summary-addon';
            addonElement.innerHTML = `
                <span class="summary-addon-name">${addonName}</span>
                <span class="summary-addon-price">+$${addonPrice}/${isYearly ? 'yr' : 'mo'}</span>
            `;
            addonsContainer.appendChild(addonElement);
        });
    }

    // Calculate total
    let total = planPrice;
    formState.addons.forEach(addon => {
        total += isYearly ? addon.priceYearly : addon.priceMonthly;
    });

    // Update total
    document.getElementById('totalLabel').textContent = isYearly
        ? 'Total (per year)'
        : 'Total (per month)';
    document.getElementById('totalAmount').textContent = isYearly
        ? `$${total}/yr`
        : `$${total}/mo`;
}

// Confirmation
function confirmOrder() {
    console.log('Order confirmed!');
    console.log('Final Order:', formState);

    // Show success screen
    formState.currentStep = 5;
    showStep(5);
}

function resetForm() {
    // Reset state
    formState.currentStep = 1;
    formState.billing = 'monthly';
    formState.selectedPlan = null;
    formState.addons = [];
    formState.personalInfo = {
        fullName: '',
        email: '',
        phone: ''
    };

    // Reset UI
    document.querySelectorAll('.plan-card').forEach(card => {
        card.classList.remove('selected');
    });

    document.querySelectorAll('.addon-card input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    document.getElementById('fullName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';

    document.querySelector('input[name="billing"][value="monthly"]').checked = true;

    // Reset pricing
    updatePricing();

    // Go to step 1
    showStep(1);

    console.log('Form reset');
}

// Utility Functions
function formatPhoneNumber(value) {
    // Auto-format phone number as user types (optional enhancement)
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
        return [match[1], match[2], match[3]].filter(Boolean).join(' ');
    }
    return value;
}

// Expose functions to global scope for onclick handlers
window.nextStep = nextStep;
window.previousStep = previousStep;
window.goToStep = goToStep;
window.confirmOrder = confirmOrder;
window.resetForm = resetForm;

console.log('Emperor Multi-step form is ready!');