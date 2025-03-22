import Link from "next/link"
import { ArrowRight, Lock, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">LifeChain</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="#features" className="text-sm font-medium">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium">
              How It Works
            </Link>
            <Link href="/auth/login" className="text-sm font-medium">
              Login
            </Link>
            <Button asChild>
              <Link href="/auth/login?signup=true">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-24 md:py-32">
          <div className="grid gap-10 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Secure Your Digital Legacy
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                LifeChain helps you preserve your digital assets and memories for future generations with blockchain
                security.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/auth/login?signup=true">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Link href="#learn-more">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[350px] w-[350px] rounded-full bg-gradient-to-r from-primary/20 to-primary/40 flex items-center justify-center">
                <Lock className="h-24 w-24 text-primary" />
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="bg-muted py-16">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Secure Storage</h3>
                <p className="text-gray-500">Store your digital assets securely on the blockchain and IPFS.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Trustee Management</h3>
                <p className="text-gray-500">Assign trusted individuals to manage access to your digital legacy.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Legal Integration</h3>
                <p className="text-gray-500">Generate legal documents that integrate with your blockchain assets.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              How It Works
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary text-primary-foreground w-10 h-10 flex items-center justify-center mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Create Capsules</h3>
                <p className="text-gray-500">Upload your content and set access conditions.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary text-primary-foreground w-10 h-10 flex items-center justify-center mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Assign Trustees</h3>
                <p className="text-gray-500">Select trusted individuals who can approve access.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary text-primary-foreground w-10 h-10 flex items-center justify-center mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Secure Access</h3>
                <p className="text-gray-500">Content is only accessible when trustees approve.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">LifeChain</span>
          </div>
          <p className="text-sm text-gray-500">© 2025 LifeChain. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-gray-500 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

