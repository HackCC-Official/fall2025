// File: pages/application/index.tsx
// This file redirects /application to /application/hackathon

import { GetServerSideProps } from "next";

export default function ApplicationIndex() {
  // This component will never render due to the redirect
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/panel/hackathon',
      permanent: false,
    },
  };
};