document.addEventListener('DOMContentLoaded', function() {
    // Terminal elements
    const terminal = document.getElementById('terminal');
    const terminalHeader = document.querySelector('.terminal-header');
    const terminalToggle = document.getElementById('terminalToggle');
    
    // Drag state
    let isDragging = false;
    let offsetX, offsetY;
    let startX, startY;
    let startLeft, startTop;

    // Toggle terminal visibility
    function toggleTerminal() {
        terminal.classList.toggle('hidden');
        // If showing, bring to front
        if (!terminal.classList.contains('hidden')) {
            terminal.style.zIndex = '1000';
            terminalToggle.style.zIndex = '1001';
        }
    }


    // Toggle terminal on button click
    terminalToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTerminal();
    });

    // Start dragging
    terminalHeader.addEventListener('mousedown', (e) => {
        // Don't start dragging if clicking on buttons
        if (e.target.classList.contains('terminal-btn') || 
            e.target.parentElement.classList.contains('terminal-buttons')) {
            return;
        }
        
        isDragging = true;
        const rect = terminal.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = parseFloat(terminal.style.left) || (window.innerWidth - terminal.offsetWidth) / 2;
        startTop = parseFloat(terminal.style.top) || 50;
        
        // Bring to front when dragging starts
        terminal.style.zIndex = '1002';
        terminalToggle.style.zIndex = '1001';
        
        e.preventDefault();
    });

    // Stop dragging
    document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        
        isDragging = false;
        
        // If it was just a click, don't update position
        if (Math.abs(e.clientX - startX) < 5 && Math.abs(e.clientY - startY) < 5) {
            return;
        }
    });

    // Move terminal while dragging
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        
        // Update terminal position
        terminal.style.left = `${x}px`;
        terminal.style.top = `${y}px`;
        terminal.style.transform = 'none'; // Remove centering transform
    });

    // Prevent text selection while dragging
    document.addEventListener('selectstart', (e) => {
        if (isDragging) {
            e.preventDefault();
        }
    });

    // Close terminal when clicking outside
    document.addEventListener('click', (e) => {
        if (!terminal.contains(e.target) && e.target !== terminalToggle) {
            terminal.classList.add('hidden');
        }
    });

    // DOM Elements
    // DOM Elements
    const terminalBody = document.getElementById('terminal-body');
    const commandLine = document.querySelector('.command-line');
    const commandText = document.getElementById('command-text');
    const cursor = document.getElementById('cursor');
    
    // Terminal state
    let commandHistory = [];
    let historyIndex = -1;
    let currentCommand = '';
    let isProcessing = false;
    
    // JARVIS responses
    const responses = {
        help: `
Available commands:
  about     - Learn more about me
  skills    - View my technical skills
  projects  - See my featured projects
  contact   - Get in touch with me
  clear     - Clear the terminal
  date      - Show current date and time
  theme     - Change terminal theme
  help      - Show this help message
        `,
        about: `
L.I.M.B.U. v2.5 

I am an advanced AI assistant designed to showcase the portfolio of my creator. 
My primary functions include providing information about skills, projects, 
and facilitating communication with potential collaborators.

Type 'skills' to view technical capabilities or 'projects' to see recent work.
        `,
        skills: `
TECHNICAL PROFICIENCIES:

• Frontend: HTML5, CSS3, JavaScript (ES6+), React, Vue.js
• Backend: Node.js, Python, Express, Django, RESTful APIs
• Databases: MongoDB, PostgreSQL, Firebase
• Tools: Git, Docker, AWS, Webpack, Babel
• Design: UI/UX, Responsive Design, Figma, Adobe XD

For more details, please visit the skills section below.
        `,
        projects: `
FEATURED PROJECTS:

1. Project Aurora - A revolutionary AI platform
   • React, Node.js, TensorFlow
   • Real-time data processing
   • Machine learning integration

2. Nebula Dashboard
   • Vue.js, D3.js, Express
   • Data visualization suite
   • Customizable widgets

Scroll down to view project details and links.
        `,
        contact: `
CONTACT INFORMATION:

Email: contact@yourdomain.com
GitHub: github.com/yourusername
LinkedIn: linkedin.com/in/yourprofile
Twitter: @yourhandle

For business inquiries or collaboration opportunities, 
please use the contact form below.
        `,
        date: () => {
            const now = new Date();
            return `Current date and time: ${now.toLocaleString()}`;
        },
        theme: (args) => {
            const theme = args[0];
            const themes = {
                'default': { bg: 'rgba(0, 10, 20, 0.95)', border: 'rgba(0, 255, 255, 0.2)' },
                'matrix': { bg: 'rgba(0, 30, 0, 0.95)', border: 'rgba(0, 255, 0, 0.3)' },
                'neon': { bg: 'rgba(30, 0, 30, 0.95)', border: 'rgba(255, 0, 255, 0.3)' },
                'ocean': { bg: 'rgba(0, 20, 40, 0.95)', border: 'rgba(0, 200, 255, 0.3)' }
            };
            
            if (theme && themes[theme]) {
                const terminal = document.querySelector('.terminal');
                terminal.style.background = themes[theme].bg;
                terminal.style.borderColor = themes[theme].border;
                return `Theme changed to: ${theme}`;
            } else {
                return `Available themes: ${Object.keys(themes).join(', ')}`;
            }
        },
        clear: ''
    };

    // Type writer effect
    async function typeWriter(text, element, speed = 20) {
        return new Promise(resolve => {
            let i = 0;
            const type = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, Math.random() * 30 + speed);
                } else {
                    resolve();
                }
            };
            type();
        });
    }

    // Print text to terminal
    async function printToTerminal(text, className = '') {
        const line = document.createElement('div');
        if (className) line.className = className;
        terminalBody.insertBefore(line, commandLine);
        await typeWriter(text, line);
        return line;
    }

    // Process command
    async function processCommand(command) {
        if (isProcessing) return;
        isProcessing = true;
        
        // Add command to history
        if (command.trim() !== '' && command !== commandHistory[commandHistory.length - 1]) {
            commandHistory.push(command);
            historyIndex = commandHistory.length;
        }
        
        // Show command in terminal
        const cmdLine = document.createElement('div');
        cmdLine.className = 'command-line';
        cmdLine.innerHTML = `<span class="prompt">user@portfolio:~$</span> <span class="command-text">${command}</span>`;
        terminalBody.insertBefore(cmdLine, commandLine);
        
        // Process command
        const [cmd, ...args] = command.trim().split(' ');
        
        // Add slight delay before response
        await new Promise(resolve => setTimeout(resolve, 200));
        
        if (cmd === 'clear') {
            // Clear terminal
            while (terminalBody.firstChild !== commandLine) {
                terminalBody.removeChild(terminalBody.firstChild);
            }
        } else if (responses[cmd]) {
            // Handle commands with responses
            const responseText = typeof responses[cmd] === 'function' 
                ? responses[cmd](args) 
                : responses[cmd];
            
            if (responseText) {
                await printToTerminal(responseText, 'command-response');
            }
        } else if (cmd) {
            // Command not found
            await printToTerminal(`Command not found: ${cmd}\nType 'help' for available commands.`, 'command-error');
        }
        
        // Scroll to bottom
        terminalBody.scrollTop = terminalBody.scrollHeight;
        isProcessing = false;
    }

    // Initialize terminal
    async function initTerminal() {
        // Initial greeting
        await printToTerminal('Initializing L.I.M.B.U. v2.5...');
        await new Promise(resolve => setTimeout(resolve, 500));
        await printToTerminal('Checking system status...');
        await new Promise(resolve => setTimeout(resolve, 300));
        await printToTerminal('Establishing secure connection...');
        await new Promise(resolve => setTimeout(resolve, 700));
        await printToTerminal('\n> Welcome to the portfolio terminal interface.');
        await printToTerminal('> Type \'help\' to see available commands.\n');
        
        // Focus on terminal
        commandLine.scrollIntoView();
    }

    // Event listeners
    document.addEventListener('keydown', async (e) => {
        if (document.activeElement === document.body) {
            // Handle typing in terminal
            if (e.key.length === 1) {
                currentCommand += e.key;
                commandText.textContent = currentCommand;
            } else if (e.key === 'Backspace') {
                currentCommand = currentCommand.slice(0, -1);
                commandText.textContent = currentCommand;
            } else if (e.key === 'Enter' && currentCommand.trim() !== '') {
                const cmd = currentCommand;
                currentCommand = '';
                commandText.textContent = '';
                await processCommand(cmd);
            } else if (e.key === 'ArrowUp') {
                // Command history navigation
                if (commandHistory.length > 0 && historyIndex > 0) {
                    historyIndex--;
                    currentCommand = commandHistory[historyIndex];
                    commandText.textContent = currentCommand;
                }
            } else if (e.key === 'ArrowDown') {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    currentCommand = commandHistory[historyIndex] || '';
                    commandText.textContent = currentCommand;
                } else {
                    historyIndex = commandHistory.length;
                    currentCommand = '';
                    commandText.textContent = '';
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                // Simple tab completion
                const commands = Object.keys(responses);
                const input = currentCommand.toLowerCase();
                const matches = commands.filter(cmd => cmd.startsWith(input));
                
                if (matches.length === 1) {
                    currentCommand = matches[0];
                    commandText.textContent = currentCommand;
                } else if (matches.length > 1) {
                    // Show possible completions
                    await printToTerminal('\n' + matches.join('  '), 'command-suggestion');
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                }
            }
        }
    });

    // Click anywhere to focus terminal
    document.addEventListener('click', () => {
        commandLine.focus();
    });

    // Start terminal
    initTerminal();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-level');
    
    const animateSkills = () => {
        skillBars.forEach(bar => {
            const level = bar.parentElement.getAttribute('data-level');
            if (isElementInViewport(bar) && !bar.style.width) {
                bar.style.width = `${level}%`;
                bar.style.transition = 'width 1.5s ease-in-out';
            }
        });
    };

    // Check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#00f7ff" },
                shape: { type: "circle" },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#00a8ff",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: { enable: false, rotateX: 600, rotateY: 1200 }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 1 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }

    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('animated');
            }
        });
    };

    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Initialize animations
    window.addEventListener('scroll', () => {
        animateSkills();
        animateOnScroll();
    });

    // Initial check in case elements are already in viewport
    animateSkills();
    animateOnScroll();

    // Form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your form submission logic here
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }
});