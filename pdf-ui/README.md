# @intersect.mbo/pdf-ui

The `@intersect.mbo/pdf-ui` is a React.js package that includes all the necessary logic and UI components required for the operation of a proposal discussion forum.

## Table of content:

-   [Installation](#installation)
-   [Usage](#usage)
-   [Project Structure](#project-structure)
-   [Prerequisites](#prerequisites)
-   [Running locally](#running-locally)

## Installation

To install this pacakge, use npm or yarn:

### `npm install @intersect.mbo/pdf-ui`

or

### `yarn add @intersect.mbo/pdf-ui`

## Usage

After installation, you can import the component and use it in your project.

#### This is an example of implementing a package in a [NextJs](https://nextjs.org/) application

```tsx
'use client';
import dynamic from 'next/dynamic';
import { useValidateMutation } from "@/hooks/mutations";
import { useCardano, useGovernanceActions } from "@/context";

const ProposalDiscussion = dynamic(() => import('@intersect.mbo/pdf-ui'), {
    ssr: false,
});

export default function Page() {
    const { validateMetadata } = useValidateMutation();
    const { walletApi, ...context } = useCardano();
    const { createGovernanceActionJsonLD, createHash } = useGovernanceActions();

    return (
        <ProposalDiscussion
            pdfApiUrl="https://xxxxx"
            walletAPI={{
              ...context,
              ...walletApi,
              createGovernanceActionJsonLD,
              createHash,
            }}
            pathname={window.location.pathname}
            validateMetadata={
              validateMetadata as ComponentProps<
                typeof ProposalDiscussion
              >["validateMetadata"]
            }
        />
    );
}
```


#### Example of Implementing a Package Using CommonJS Modules (CJS):

```tsx
import React, { ComponentProps } from "react";
import "@intersect.mbo/pdf-ui/style";
import { useCardano, useGovernanceActions } from "@/context";
import { useValidateMutation } from "@/hooks/mutations";

const ProposalDiscussion = React.lazy(
  () => import("@intersect.mbo/pdf-ui/cjs"),
);

export const ProposalDiscussionPillar = () => {
  const { validateMetadata } = useValidateMutation();
  const { walletApi, ...context } = useCardano();
  const { createGovernanceActionJsonLD, createHash } = useGovernanceActions();

  return (
          <ProposalDiscussion
            pdfApiUrl="https://xxxxx"
            walletAPI={{
              ...context,
              ...walletApi,
              createGovernanceActionJsonLD,
              createHash,
            }}
            pathname={window.location.pathname}
            validateMetadata={
              validateMetadata as ComponentProps<
                typeof ProposalDiscussion
              >["validateMetadata"]
            }
          />
  )
};
```

## Project Structure

```pdf-ui
├── node_modules
├── src
│   ├── assets
│   ├── components
│   ├── context
│   ├── lib
│   ├── pages
│   ├── styles
│   └── App.jsx
│   └── index.js
│   └── index.scss
└── rollup.config.js
```

-   **assets/**: The `@intersect.mbo/pdf-ui` assets.
-   **components/**: The `@intersect.mbo/pdf-ui` components.
-   **context/**: Context for global application state.
-   **lib/**: Libraries and helper functions.
-   **pages/**: Application pages.
-   **styles/**: SCSS files for styling the application.
-   **index.js**: Main application file.
-   **index.scss**: Main application styles file.
-   **rollup.config.js**: Configuration for the Rollup bundler.

## Prerequisites

Before starting, please ensure you have the following:

-   Node.js and npm - Latest versions. You can download them from [here](https://nodejs.org/en/download/).

## Running locally

To launch the package, it is necessary to have an application (for example, a Next.js app) into which this package is imported. This wrapper application must provide wallet connectivity to supply the wallet API to the package.
