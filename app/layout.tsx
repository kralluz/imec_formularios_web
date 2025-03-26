import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AuthProvider } from "@/contexts/auth-context";
import { QuestionnaireProvider } from "@/contexts/questionnaire-context";
import { SectorProvider } from "@/contexts/sector-context";
import { QuestionProvider } from "@/contexts/question-context";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";
import "@ant-design/v5-patch-for-react-19";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IMEC Formulários",
  description: "Sistema de gerenciamento de formulários médicos",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <QuestionnaireProvider>
              <SectorProvider>
                <QuestionProvider>{children}</QuestionProvider>
              </SectorProvider>
            </QuestionnaireProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
