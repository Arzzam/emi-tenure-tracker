import { Toaster } from 'sonner';
import StoreProvider from './context/StoreProvider/StoreProvider';
import { ThemeProvider } from './context/ThemeProvider/themeProvider';
import HomeRouter from './router/HomeRouter';

function App() {
  return (
    <StoreProvider>
      <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
        <HomeRouter />
        <Toaster />
      </ThemeProvider>
    </StoreProvider>
  );
}

export default App;
