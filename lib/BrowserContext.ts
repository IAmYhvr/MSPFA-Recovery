import React, { Dispatch, SetStateAction, useContext } from 'react';

export type Browser = 'chrome' | 'chrome-with-google' | 'firefox' | 'safari' | 'opera' | 'chromium' | 'mobile';

export type BrowserState = readonly [Browser | undefined, Dispatch<SetStateAction<Browser | undefined>>];

const BrowserContext = React.createContext<BrowserState>(undefined as never);

export default BrowserContext;

export const useBrowser = () => useContext(BrowserContext);
