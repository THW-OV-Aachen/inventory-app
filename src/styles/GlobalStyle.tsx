import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    color: var(--color-font-primary);
  }

  a {
    text-decoration: none;
    color: #3b82f6;
  }
`;

export default GlobalStyle;
