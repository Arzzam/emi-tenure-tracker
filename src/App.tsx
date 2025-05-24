import { Toaster } from 'sonner';
import StoreProvider from './context/StoreProvider/StoreProvider';
import { ThemeProvider } from './context/ThemeProvider/themeProvider';
import HomeRouter from './router/HomeRouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './hooks/queryClient';

function App() {
    return (
        <StoreProvider>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <QueryClientProvider client={queryClient}>
                    <HomeRouter />
                </QueryClientProvider>
                <Toaster />
            </ThemeProvider>
        </StoreProvider>
    );
}

export default App;
