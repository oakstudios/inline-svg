# Inline SVG

<!-- **[Demo](https://oakstudios.github.io/inline-svg)** -->

## Installation

```
npm i @oakstudios/inline-svg
```

### Web Component

1. Load the web component. Choose the option that best suits your needs:
    
    Using a `script` tag placed at the end of the `body`:
    
    ```html
    <!-- this automatically registers the component in the window as mechanical-ragger -->
    <script type="module" src="https://unpkg.com/@oakstudios/inline-svg@latest/auto-register.js"></script>
    ```
    
    _OR_ importing the same auto-register function in JS:
    
    ```js
    import "@oakstudios/inline-svg/auto-register";
    ```
    
    _OR_ registering the component manually:
    
    ```js
    import InlineSVG from "@oakstudios/inline-svg";
    
    customElements.define("inline-svg", InlineSVG);
    ```

2. Then add it to your HTML:

   ```html
   <inline-svg src="/path/to/file.svg"></inline-svg>
   ```

## Acknowledgements
https://www.npmjs.com/package/react-inlinesvg
