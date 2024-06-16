declare module '../api/fetchMedications' {
  export function fetchMedications(query: string): Promise<any>;
}

declare module '../api/rxnormApi' {
  export function getSuggestionsFromRxNorm(query: string): Promise<any>;
}

declare module '../utils/ToggleContext' {
  import { ReactNode } from 'react';

  interface ToggleContextProps {
    isAdvanced: boolean;
    toggleAdvancedSearch: () => void;
    setSimpleSearch: () => void;
    setAdvancedSearch: () => void;
  }

  export const ToggleProvider: ({ children }: { children: ReactNode }) => JSX.Element;
  export const useToggle: () => ToggleContextProps;
}

declare module '../styles/theme' {
  export const lightTheme: object;
  export const darkTheme: object;
}

declare module '../utils/driverTour' {
  export const driverObj: object;
}
