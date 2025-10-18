# Proportional.uk - Electoral Reform for the UK

This repository contains the source code for a single-page site advocating for the adoption of AMS+ (Additional Member System Plus), an improved version of the Additional Member System already used in Scotland and Wales.

## Goals of this Page

- Clearly demonstrate the advantages of AMS+ (AMS with approval voting for constituency seats)
- Compare AMS+ with First Past the Post (FPTP) and traditional AMS
- Show how approval voting makes constituency voting more expressive
- Demonstrate how the two-vote system balances local and proportional representation
- Explain how consensus candidates are rewarded through approval voting

## What is AMS+?

AMS+ is an improved version of the Additional Member System that combines:

- **Two Separate Ballots**: Constituency ballot and party list ballot (familiar from current AMS)
- **Approval Voting for Constituency**: Voters approve multiple candidates they trust, not forced into a single choice
- **Proportional Party List**: Voters select one party for regional representation
- **Local Representation**: Candidate with most approvals wins the local seat
- **Proportional Top-Up**: Party list seats distributed proportionally to ensure overall proportionality

This system builds on the proven success of AMS in Scotland and Wales while addressing the limitation of single-choice constituency voting through approval voting, allowing voters to express genuine preferences for multiple candidates they trust.

## Project Structure

The project is organized for maintainability:

```
proportional.uk/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # All styles and responsive design
├── js/
│   ├── config.js      # Configuration and constants
│   ├── utils.js       # Utility functions
│   ├── logger.js      # Logging utilities
│   └── main.js        # Main application logic
├── package.json        # Development dependencies
└── README.md          # This file
```

## Features

- **Clear Ballot Demonstrations**: Visual representation of approval voting ballots
- **Benefits Overview**: Key advantages of AMS+ compared to other systems
- **System Explanation**: Step-by-step breakdown of how AMS+ works
- **Comparative Analysis**: AMS+ vs FPTP vs Traditional AMS
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (version 14 or higher)
- npm

### Installation

1.  Clone the repo

    ```sh
    git clone https://github.com/fsargent/proportional.uk.git
    cd proportional.uk
    ```

2.  Install dependencies

    ```sh
    npm install
    ```

3.  Start the development server
    ```sh
    npm run dev
    ```

The site will be available at `http://localhost:3000`.

### Alternative: Manual Setup

If you prefer not to use npm:

1.  Install browser-sync globally

    ```sh
    npm install -g browser-sync
    ```

2.  Run the server
    ```sh
    browser-sync start --server --files "*.html, css/*.css, js/*.js"
    ```

## Development

### Code Organization

- **HTML**: Clean, semantic markup with no embedded JavaScript or CSS
- **CSS**: Organized with CSS custom properties (variables) and responsive design
- **JavaScript**: Modular ES6+ code for functionality

### Key Files

- **config.js**: Constants and configuration
- **utils.js**: Helper and utility functions
- **logger.js**: Logging utility functions
- **main.js**: Application initialization and main functionality

### Adding New Features

1. Create new functionality in the appropriate module
2. Export functions that need to be used elsewhere
3. Import and use in the main.js or other modules as needed
4. Add corresponding CSS styles in css/style.css

### Browser Support

The site uses modern JavaScript features and CSS. For production use, consider adding:

- Babel for JavaScript transpilation
- PostCSS for CSS processing
- A bundler like Webpack or Vite

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Electoral Reform Society for information on voting systems
- Contributors to the electoral reform movement
