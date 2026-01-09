# Proportional.uk - Electoral Reform for the UK

A single-page site advocating for approval-based electoral reform in the United Kingdom. The site presents two modern voting systems that address the problems with First Past the Post without the complexity of ranked-choice voting.

## What This Site Covers

### The Problem
- Why FPTP (First Past the Post) is failing UK democracy
- How millions of votes are wasted in "safe seats"  
- The disconnect between vote share and seat allocation
- Why voters are forced into tactical voting

### Why Not STV or Ranked-Choice?
- Problems with ranking-based systems (complexity, non-monotonicity, slow counting)
- Why rating (approval) is simpler and more robust than ranking
- Academic research on ballot error rates and voter understanding

### Two Solutions

#### AMS+ (Approval-MMP)
An improved version of the Additional Member System already used in Scotland and Wales:
- Two ballots: constituency approval voting + party list vote
- Keeps local constituency MPs
- Proportional top-up from party lists
- Builds on proven, familiar systems

#### Proportional Approval
A fully proportional system using Sequential Proportional Approval Voting (SPAV):
- One simple ballot: approve any candidates you like
- Maximum proportionality
- No geographic constituencies (regional multi-member)
- Fast counting, simple to understand

## Project Structure

```
proportional.uk/
├── src/
│   ├── app.html             # Base HTML template
│   ├── app.css              # Global styles
│   ├── lib/
│   │   ├── components/      # Svelte components
│   │   │   ├── ProblemSection.svelte
│   │   │   ├── RankingProblems.svelte
│   │   │   ├── RatingVsRanking.svelte
│   │   │   ├── SystemChoice.svelte
│   │   │   ├── AMSPlusSection.svelte
│   │   │   ├── ProportionalApprovalSection.svelte
│   │   │   ├── BenefitCard.svelte
│   │   │   ├── StepCard.svelte
│   │   │   ├── FAQItem.svelte
│   │   │   └── ...
│   │   ├── stores/          # Svelte stores
│   │   │   └── navigation.ts
│   │   ├── config.ts        # Party data, election results
│   │   └── utils.ts         # Utility functions
│   └── routes/
│       ├── +layout.svelte   # Site layout
│       ├── +page.svelte     # Main page
│       └── fptp-challenge/  # Interactive FPTP demo
├── static/                  # Static assets
├── svelte.config.js
├── vite.config.ts
└── package.json
```

## Features

- **Narrative flow**: Guides visitors through the problems with current systems before presenting solutions
- **Interactive choice**: Users choose between local+proportional (AMS+) or fully proportional (Proportional Approval)
- **Interactive ballot demos**: Try out both voting systems
- **FPTP Challenge**: Interactive game showing FPTP's flaws
- **Responsive design**: Works on desktop and mobile
- **SvelteKit**: Modern, fast, SEO-friendly

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or bun

### Installation

```bash
git clone https://github.com/fsargent/proportional.uk.git
cd proportional.uk
npm install
```

### Development

```bash
npm run dev
```

The site will be available at `http://localhost:5173`.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Key Technologies

- **SvelteKit** - Full-stack web framework
- **TypeScript** - Type safety
- **Svelte 5** - Component framework with runes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Resources

- [Make Votes Matter](https://www.makevotesmatter.org.uk/) - Campaign for proportional representation
- [Electoral Reform Society](https://www.electoral-reform.org.uk/) - Research and advocacy
- [Center for Election Science](https://electionscience.org/) - Approval voting research

## License

This project is licensed under the MIT License.
