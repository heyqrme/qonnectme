import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { QrCode, Share2, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <QrCode className="h-6 w-6 text-primary" />
          <span className="ml-2 font-semibold text-lg font-headline">Qonnectme</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Login
          </Link>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Your Digital Identity, Reimagined.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Qonnectme gives you a unique QR code to share your world. Customize your profile, connect with friends, and even get merch with your personal code.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="w-64 h-64 bg-card rounded-xl flex items-center justify-center p-4 shadow-lg animate-pulse">
                   <QrCode className="w-48 h-48 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Connect and Share Like Never Before</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore the features that make Qonnectme the ultimate social connection tool.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <QrCode className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Unique QR Codes</h3>
                <p className="text-muted-foreground">Instantly share your profile with a personal QR code.</p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Share2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Multimedia Sharing</h3>
                <p className="text-muted-foreground">Showcase your life with photos, videos, and music.</p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                   <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Build Your Network</h3>
                <p className="text-muted-foreground">Connect with friends and grow your social circle.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Qonnectme. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
