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

## Tech Stack

- **SvelteKit** - Full-stack framework with static site generation
- **TypeScript** - Type-safe JavaScript
- **Bun** - Fast JavaScript runtime and package manager

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (version 1.0 or higher)

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/fsargent/proportional.uk.git
   cd proportional.uk
   ```

2. Install dependencies

   ```sh
   bun install
   ```

3. Start the development server

   ```sh
   bun run dev
   ```

The site will be available at `http://localhost:5173`.

### Building for Production

To create a static build for GitHub Pages:

```sh
bun run build
```

The static files will be generated in the `build` directory.

### Preview the Production Build

```sh
bun run preview
```

## Project Structure

```
proportional.uk/
├── src/
│   ├── lib/
│   │   ├── components/     # Svelte components
│   │   ├── config.ts       # Configuration and constants
│   │   ├── utils.ts        # Utility functions
│   │   ├── charts.ts       # Chart rendering utilities
│   │   └── seat-allocation.ts  # Seat allocation algorithms
│   ├── routes/
│   │   ├── +layout.svelte  # Main layout
│   │   ├── +layout.ts      # Layout configuration (prerender)
│   │   └── +page.svelte    # Main page
│   ├── app.css            # Global styles
│   └── app.html           # HTML template
├── static/                # Static assets
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions deployment
├── package.json           # Dependencies and scripts
├── svelte.config.js       # SvelteKit configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. The deployment is handled by GitHub Actions using the workflow defined in `.github/workflows/deploy.yml`.

## Features

- **Clear Ballot Demonstrations**: Visual representation of approval voting ballots
- **Benefits Overview**: Key advantages of AMS+ compared to other systems
- **System Explanation**: Step-by-step breakdown of how AMS+ works
- **Comparative Analysis**: AMS+ vs FPTP vs Traditional AMS
- **Responsive Design**: Works on desktop and mobile devices

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
