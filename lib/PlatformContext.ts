import React, { Dispatch, SetStateAction, useContext } from 'react';

export type Platform = 'windows' | 'mac' | 'linux' | 'mobile';

export type PlatformState = readonly [Platform | undefined, Dispatch<SetStateAction<Platform | undefined>>];

const PlatformContext = React.createContext<PlatformState>(undefined as never);

export default PlatformContext;

export const usePlatform = () => useContext(PlatformContext);
