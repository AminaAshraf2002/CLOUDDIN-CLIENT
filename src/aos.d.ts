// src/aos.d.ts
declare module 'aos' {
    interface AosOptions {
      duration?: number;
      easing?: string;
      once?: boolean;
      mirror?: boolean;
      offset?: number;
      delay?: number;
      anchorPlacement?: string;
      startEvent?: string;
      disable?: boolean | ((options?: any) => boolean);
    }
  
    interface Aos {
      init(options?: AosOptions): void;
      refresh(hard?: boolean): void;
      refreshHard(): void;
    }
  
    const aos: Aos;
    export default aos;
  }