# Futuristic Portfolio

A modern, responsive portfolio website with a sci-fi/JARVIS-inspired design. This portfolio features smooth animations, interactive terminal, and a clean, futuristic UI.

## Features

- Interactive terminal with custom commands
- Responsive design that works on all devices
- Smooth scrolling and animations
- Particle.js background effect
- Skills section with animated progress bars
- Project showcase with hover effects
- Contact form (frontend only)
- Mobile-friendly navigation

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic knowledge of HTML, CSS, and JavaScript (for customization)

### Installation

1. Clone the repository or download the files
   ```bash
   git clone [your-repository-url]
   cd portfolio
   ```

2. Open `index.html` in your preferred web browser
   ```bash
   open index.html  # On macOS
   start index.html # On Windows
   xdg-open index.html # On Linux
   ```

## Customization

### Personal Information

1. Open `index.html`
2. Update the following sections with your information:
   - Replace `YOUR NAME` with your name
   - Update the about section with your bio
   - Add your skills in the skills section
   - Add your projects in the projects section
   - Update contact information

### Styling

1. Open `css/style.css` to customize colors, fonts, and animations
2. Main color variables are defined at the top of the file:
   ```css
   :root {
       --primary-color: #00f7ff;
       --secondary-color: #00a8ff;
       --accent-color: #ff00ff;
       --dark-bg: #0a0a14;
       --darker-bg: #050508;
       --light-text: #e0e0e0;
   }
   ```

### Terminal Commands

The interactive terminal supports the following commands:
- `help` - Show available commands
- `about` - Scroll to about section
- `skills` - Scroll to skills section
- `projects` - Scroll to projects section
- `contact` - Scroll to contact section
- `clear` - Clear the terminal

## Adding Projects

To add a new project:

1. Find the projects section in `index.html`
2. Duplicate one of the project cards and update:
   ```html
   <div class="project-card">
       <div class="project-image">
           <div class="project-overlay">
               <h3>Project Title</h3>
               <p>Project description goes here.</p>
               <div class="project-links">
                   <a href="#" class="project-link">View Demo</a>
                   <a href="#" class="project-link">GitHub</a>
               </div>
           </div>
       </div>
   </div>
   ```
3. Add a background image by adding a style to the `.project-image` div:
   ```html
   <div class="project-image" style="background-image: url('path/to/your/image.jpg')">
   ```

## Deployment

You can deploy this portfolio to any static web hosting service:

1. **GitHub Pages**
   - Create a new repository
   - Push your code to the `main` or `master` branch
   - Go to Settings > Pages
   - Select the branch and click Save

2. **Netlify**
   - Drag and drop the folder to Netlify
   - Or connect your GitHub repository

3. **Vercel**
   - Import your GitHub repository
   - Vercel will automatically detect and deploy your site

## Technologies Used

- HTML5
- CSS3 (with CSS Variables)
- JavaScript (ES6+)
- [Particles.js](https://vincentgarreau.com/particles.js/) for the background effect
- [Font Awesome](https://fontawesome.com/) for icons
- [Google Fonts](https://fonts.google.com/) for typography

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (latest)

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by JARVIS from Iron Man
- Particles.js for the interactive background
- All the amazing open source projects that made this possible

---

Feel free to customize this portfolio to make it your own! If you have any questions or need help, please open an issue.

Happy Coding! 🚀
