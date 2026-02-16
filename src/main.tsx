import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import gsap from "gsap";

// Configure GSAP to suppress null target warnings
gsap.config({ nullTargetWarn: false });

console.log("Main.tsx: App initializing");

const rootElement = document.getElementById("root");

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
} else {
    console.error("Main.tsx: FATAL - Root element not found!");
}
