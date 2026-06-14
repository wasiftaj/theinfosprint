import "./globals.css";

export const metadata = {
  title: "TheInfoSprint",
  description: "A tech blog",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-950">
        {children}
      </body>
    </html>
  );
}