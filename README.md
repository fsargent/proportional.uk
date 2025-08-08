# Proportional.uk - Electoral Reform for the UK

This repository contains the source code for a single-page site advocating for the adoption of closed list proportional representation in the United Kingdom, which we call Fair Share Voting.

## Goals of this Page

*   Clearly demonstrate the advantages of Fair Share Voting (closed list proportional representation) for the UK.
*   Compare and contrast it with First Past the Post (FPTP) and other voting systems.
*   Demonstrate how proportional representation would work in practice.
*   Show how regional parties can receive cross-regional support.
*   Explain how party internal democracy would work with closed lists.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js
*   npm

### Installation

1.  Clone the repo
    ```sh
	git clone https://github.com/fsargent/proportional.uk.git
    ```
2.  Install browser-sync
    ```sh
    npm install -g browser-sync
    ```
3.  Run the server
    ```sh
    browser-sync start --server --files "*.html, *.css"
    ```

The site will be available at `http://localhost:3000`.
