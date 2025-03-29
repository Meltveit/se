// src/types/next.d.ts

import { ReactNode } from 'react';



declare module 'next' {

  export interface PageProps {

    params?: any;

    searchParams?: any;

    children?: ReactNode;

  }

}



export {};