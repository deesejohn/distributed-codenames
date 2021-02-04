// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface ScDefaultTheme {
    colors: {
      blue: string;
      red: string;
      tan: string;
      black: string;
    };
  }
}
