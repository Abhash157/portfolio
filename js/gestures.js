// Initialize gesture handling
function initGestures() {
    // Only run in browser environment
    if (typeof document === 'undefined') return;
    
    // Check if Hammer is loaded
    if (typeof Hammer === 'undefined') {
        console.warn('Hammer.js not loaded. Gesture support disabled.');
        return;
    }
    // Add gesture hint element
    const gestureHint = document.createElement('div');
    gestureHint.className = 'gesture-hint';
    gestureHint.innerHTML = `
        <span><i class="fas fa-arrow-left"></i> Swipe right</span>
        <span>Swipe left <i class="fas fa-arrow-right"></i></span>
    `;
    document.body.appendChild(gestureHint);
    
    // Hide gesture hint after 5 seconds
    setTimeout(() => {
        gestureHint.style.opacity = '0';
        setTimeout(() => gestureHint.style.display = 'none', 500);
    }, 5000);
    
    // Get all sections
    const sections = document.querySelectorAll('section');
    let currentSectionIndex = 0;
    
    // Initialize HammerJS on the main element
    const main = document.querySelector('main');
    const hammer = new Hammer(main);
    
    // Configure recognizers
    hammer.get('swipe').set({ 
        direction: Hammer.DIRECTION_HORIZONTAL,
        threshold: 50,
        velocity: 0.3 
    });
    
    // Handle swipe events
    hammer.on('swipeleft swiperight', function(event) {
        // Prevent default to avoid scrolling while swiping
        event.preventDefault();
        
        if (event.type === 'swipeleft') {
            // Swipe left - go to next section
            navigateToSection(currentSectionIndex + 1);
        } else if (event.type === 'swiperight') {
            // Swipe right - go to previous section
            navigateToSection(currentSectionIndex - 1);
        }
    });
    
    // Function to navigate to a specific section
    function navigateToSection(index) {
        // Ensure the index is within bounds
        if (index >= 0 && index < sections.length) {
            // Add transition class based on direction
            const direction = index > currentSectionIndex ? 'section-swipe-left' : 'section-swipe-right';
            sections[index].classList.add(direction);
            
            // Force reflow
            void sections[index].offsetWidth;
            
            // Remove transition class
            sections[index].classList.remove(direction);
            
            // Update current section index
            currentSectionIndex = index;
            
            // Scroll to the section
            sections[index].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update active nav link
            updateActiveNavLink(sections[index].id);
            
            // Show gesture hint again if it was hidden
            const gestureHint = document.querySelector('.gesture-hint');
            if (gestureHint && gestureHint.style.display === 'none') {
                gestureHint.style.display = 'flex';
                gestureHint.style.opacity = '0.8';
                
                // Hide again after 3 seconds
                setTimeout(() => {
                    gestureHint.style.opacity = '0';
                    setTimeout(() => gestureHint.style.display = 'none', 500);
                }, 3000);
            }
        }
    }
    
    // Function to update active navigation link
    function updateActiveNavLink(sectionId) {
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Add scroll event listener to update current section
    let isScrolling = false;
    
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                // Find which section is currently in view
                const scrollPosition = window.scrollY + (window.innerHeight / 3);
                
                for (let i = 0; i < sections.length; i++) {
                    const section = sections[i];
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                        currentSectionIndex = i;
                        updateActiveNavLink(section.id);
                        break;
                    }
                }
                
                isScrolling = false;
            });
            
            isScrolling = true;
        }
    }, { passive: true });
    
    // Initialize active section on load
    if (sections.length > 0) {
        updateActiveNavLink(sections[0].id);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGestures);
} else {
    initGestures();
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initGestures };
}
