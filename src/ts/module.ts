import "../styles/style.scss"; // Keep or else vite will not include this
import { HooksModule } from "./hooks/index.ts";

HooksModule.listen();
