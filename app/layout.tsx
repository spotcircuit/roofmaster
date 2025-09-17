import type { Metadata, Viewport } from 'next'
import './globals.css'
import StackAuthProvider from './stack-provider'
import { DataProvider } from '@/lib/context/DataContext'

export const metadata: Metadata = {
  title: 'RoofMaster 24-7 | Apex Sales Pro Training',
  description: 'Master door-to-door roofing sales in 12 weeks',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="min-h-screen bg-slate-900">
        <StackAuthProvider>
          <DataProvider>
            <div className="min-h-screen flex flex-col">
              {children}
            </div>
          </DataProvider>
        </StackAuthProvider>
      </body>
    </html>
  )
}