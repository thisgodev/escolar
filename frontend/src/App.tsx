import { AppRouter } from "./router";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
