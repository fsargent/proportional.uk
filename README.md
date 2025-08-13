# Proportional.uk - Electoral Reform for the UK

This repository contains the source code for a single-page site advocating for the adoption of a hybrid proportional representation system in the United Kingdom, which we call Fair Share Voting.

## Goals of this Page

- Clearly demonstrate the advantages of Fair Share Voting (hybrid proportional representation with vote transfers) for the UK.
- Compare and contrast it with First Past the Post (FPTP) and other voting systems.
- Demonstrate how proportional representation with vote transfers would work in practice.
- Show how regional parties can receive cross-regional support through the transfer system.
- Explain how party internal democracy would work with closed lists and transfer preferences.

## What is Fair Share Voting?

Fair Share Voting is a hybrid electoral system that combines:

- **Closed List Proportional Representation**: Voters choose their preferred party
- **5% Threshold**: Parties must receive at least 5% of votes to qualify for seats
- **Vote Transfer System**: Votes from below-threshold parties are transferred to other parties based on pre-declared transfer preferences announced before the election
- **Proportional Allocation**: Remaining seats are distributed proportionally among qualifying parties

This system ensures maximum representation with no wasted votes, while maintaining electoral stability and encouraging coalition building. Transfer preferences are publicly announced before each election, ensuring transparency and allowing voters to make informed choices.

## Project Structure

The project has been refactored for better maintainability:

```
proportional.uk/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # All styles and responsive design
├── js/
│   ├── config.js      # Configuration and constants
│   ├── utils.js       # Utility functions
│   ├── seat-allocation.js  # Core seat allocation logic
│   ├── charts.js      # Parliament visualization
│   ├── demo.js        # Interactive demonstration
│   └── main.js        # Main application logic
├── package.json        # Development dependencies
└── README.md          # This file
```

## Features

- **Interactive Parliament Charts**: Visual representation of seat allocation under different systems
- **Vote Tuner**: Adjust vote shares and see real-time seat allocation changes
- **Transfer Preferences**: Configure how below-threshold party votes are transferred
- **Step-by-Step Allocation**: See exactly how seats are allocated using the Fair Share system
- **Responsive Design**: Works on desktop and mobile devices
- **Real Election Data**: Uses actual 2024 UK General Election results

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
- **JavaScript**: Modular ES6+ code split into logical concerns

### Key Modules

- **config.js**: Contains all constants, party metadata, and election data
- **utils.js**: Helper functions for calculations and data processing
- **seat-allocation.js**: Core algorithms for proportional seat allocation
- **charts.js**: Parliament visualization using HTML5 Canvas
- **demo.js**: Interactive demonstration and vote tuning interface
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

## Data Sources

- **Election Results**: [Electoral Reform Society – Election 2024](https://election2024.electoral-reform.org.uk/)
- **Party Colors**: Official party brand guidelines
- **Vote Totals**: National vote counts from the 2024 General Election

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Electoral Reform Society for election data
- Make Votes Matter for advocacy support
- Contributors to the proportional representation movement
