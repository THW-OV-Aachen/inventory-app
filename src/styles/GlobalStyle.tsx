import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #6392c1ff, #0073ffff);
    color: #1f2937;
  }

  a {
    text-decoration: none;
    color: #3b82f6;
  }
`;

export default GlobalStyle;
