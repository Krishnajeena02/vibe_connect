import { Provider } from "react-redux";
import { store } from "@/config/redux/store";
import { ThemeProvider } from 'next-themes';
import "@/styles/globals.css";
import "@/pages/dashboard/index.module.css"

export default function App({ Component, pageProps }) {
  return <>
   <ThemeProvider attribute="class" defaultTheme="light">
    <Provider store={store} >
  <Component {...pageProps} />

  </Provider>
  </ThemeProvider>
  </>
}
