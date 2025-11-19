import "./globals.css";
import NavBar from "@/components/NavBar";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Event Planner",
  description: "Discover and manage events effortlessly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NavBar />
          <div id="modal-root" />
          {children}
          
        </AuthProvider>
        
      </body>
    </html>
  );
}