import ThemeRegistry from '@/components/ThemeRegistry'

export const metadata = {
  title: 'Pantry Tracker',
  description: 'Track your pantry items and get recipe suggestions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}