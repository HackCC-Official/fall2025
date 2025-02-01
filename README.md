# HackCC Spring 2025 Main Website
The frontend application for HackCC of Spring 2025 that serves as the main website for hackathon particpants and as the an interface for organizers, sponsors or volunteers to use.

## Documentation
To start contributing to this repository, please review all the markdowns in [docs folder](./client/docs) that is in the client folder (the src folder for our Next app).

It will be based loosely on [Bulletproof React](https://github.com/alan2207/bulletproof-react)

## Getting Started
Follow the instructions below to run the application locally on your computer.

### Prequisites
Requirements to deploy and run this project
- [Node.js v17 or higher.](https://nodejs.org/en/about/previous-releases)
- [Npm latest release](https://www.npmjs.com/)

### Extension Requirement
Please use the following extension in order to comply to the project's stand
- [Tailwind Sorter](https://marketplace.visualstudio.com/items?itemName=dejmedus.tailwind-sorter)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Installation
Enter your working repository/folder and clone the repository
```bash
git clone git@github.com:HackCC-Official/spring2025.git
```
Then enter directory and install the dependencies
```bash
cd spring2025/client
npm install
```
### Running website locally
First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
