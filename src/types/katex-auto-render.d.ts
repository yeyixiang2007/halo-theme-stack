declare module "katex/contrib/auto-render" {
  interface AutoRenderDelimiter {
    left: string;
    right: string;
    display: boolean;
  }

  interface AutoRenderOptions {
    delimiters?: AutoRenderDelimiter[];
    ignoredTags?: string[];
    ignoredClasses?: string[];
    throwOnError?: boolean;
    strict?: boolean | string | ((errorCode: string, errorMsg: string, token?: unknown) => string);
  }

  export default function renderMathInElement(element: HTMLElement, options?: AutoRenderOptions): void;
}
