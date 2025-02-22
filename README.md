# HackCC Spring 2025 Main Website
The frontend application for HackCC of Spring 2025 that serves as the main website for hackathon particpants and as the an interface for organizers, sponsors or volunteers to use.

## Documentation
To start contributing to this repository, please review all the markdowns in [docs folder](./client/docs) that is in the client folder (the src folder for our Next app).

It will be based loosely on [Bulletproof React](https://github.com/alan2207/bulletproof-react)

> [!IMPORTANT]
> We are using a library component called **shadcn**. Consider checking their [documentation here](https://ui.shadcn.com/docs) if you plan on using, or modifying an existing component that utilizes a shadcn component. Do not modify any content in  `src/components/ui` unless given explicit permission to.  You can add components to it through using shadcn's command, but you shouldn't remove or edit any component that are used. 

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

### Environment Variable
Use the following env template or the one found `.env.example` in order to deploy to production or development server
```
# for deploying to prod or dev 
MAIN_HOSTNAME=
MINIO_HOSTNAME=
NEXT_PUBLIC_QR_SERVICE_URL=
NEXT_PUBLIC_OUTREACH_SERVICE_URL=
```

### Running website locally
First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
