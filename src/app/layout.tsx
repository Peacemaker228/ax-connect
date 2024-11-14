import type { Metadata } from 'next'
import './globals.css'
import React, { ReactNode } from 'react'
import { Open_Sans } from 'next/font/google'
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/theme-providers'
import { cn } from '@/lib/utils'
import { ModalProvider } from '@/components/providers/modal-provider'
import { SocketProvider } from '@/components/providers/socket-provider'

const font = Open_Sans({ subsets: ['latin'] })

// const geistSans = localFont({
//   src: './fonts/GeistVF.woff',
//   variable: '--font-geist-sans',
//   weight: '100 900',
// })
// const geistMono = localFont({
//   src: './fonts/GeistMonoVF.woff',
//   variable: '--font-geist-mono',
//   weight: '100 900',
// })

export const metadata: Metadata = {
  title: 'Ax-Connect',
  description: 'Meetings',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ClerkProvider afterSignOutUrl={'/'}>
      <html lang="en" suppressHydrationWarning>
        <body
          // className={cn(geistSans.variable, geistMono.variable, `antialiased`)}
          className={cn(font.className, 'bg-white dark:bg-[#313338]')}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="ax-connect-theme">
            {/*<SignedOut>*/}
            {/*  <SignInButton />*/}
            {/*</SignedOut>*/}
            {/*<SignedIn>*/}
            {/*  <UserButton />*/}
            {/*</SignedIn>*/}
            <SocketProvider>
              <ModalProvider />
              {children}
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
