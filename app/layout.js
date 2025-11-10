import "./globals.css";
export const metadata = {
  title: "Event Planner",
  description: "Discover and manage events effortlessly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
