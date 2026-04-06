const mathContainerSelector = ".article-content, .item-html";
const mathRenderedAttribute = "data-stack-math-rendered";
const katexStylesheetSelector = 'link[data-stack-katex="true"]';
const katexStylesheetHref = "/themes/theme-Stack2/assets/lib/katex/katex.min.css";

const inlineMathPattern = /\$\$[\s\S]+?\$\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\]|\$[^$\n]+\$/;

let katexStylesheetPromise: Promise<void> | null = null;

function getMathContainers() {
  return Array.from(document.querySelectorAll<HTMLElement>(mathContainerSelector)).filter(
    (element) => !element.hasAttribute(mathRenderedAttribute),
  );
}

function hasMathCandidate(elements: HTMLElement[]) {
  return elements.some(
    (element) =>
      inlineMathPattern.test(element.textContent || "") || Boolean(element.querySelector(".katex, .katex-display")),
  );
}

function hasRawMath(elements: HTMLElement[]) {
  return elements.some((element) => inlineMathPattern.test(element.textContent || ""));
}

function ensureMathStylesheet() {
  const loadedStylesheet = document.querySelector<HTMLLinkElement>(katexStylesheetSelector);
  if (loadedStylesheet) {
    return Promise.resolve();
  }

  if (katexStylesheetPromise) {
    return katexStylesheetPromise;
  }

  katexStylesheetPromise = new Promise((resolve, reject) => {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = katexStylesheetHref;
    stylesheet.dataset.stackKatex = "true";
    stylesheet.onload = () => resolve();
    stylesheet.onerror = () => reject(new Error(`Failed to load KaTeX stylesheet: ${katexStylesheetHref}`));

    document.head.appendChild(stylesheet);
  });

  return katexStylesheetPromise;
}

export async function initMathIfExist() {
  const containers = getMathContainers();
  if (!containers.length || !hasMathCandidate(containers)) {
    return;
  }

  await ensureMathStylesheet();

  if (!hasRawMath(containers)) {
    return;
  }

  const { default: renderMathInElement } = await import("katex/contrib/auto-render");

  containers.forEach((container) => {
    renderMathInElement(container, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
      ],
      throwOnError: false,
      strict: "ignore",
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
      ignoredClasses: ["highlight"],
    });

    container.setAttribute(mathRenderedAttribute, "true");
  });
}
