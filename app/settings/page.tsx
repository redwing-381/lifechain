import Link from "next/link"
import { Bell, CreditCard, FileText, Key, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import DashboardLayout from "@/components/dashboard-layout"

export default function SettingsPage() {
  const settingsCategories = [
    {
      title: "Account",
      description: "Manage your account settings and preferences",
      icon: User,
      items: [
        { name: "Profile", href: "/settings/profile" },
        { name: "Email", href: "/settings/email" },
        { name: "Password", href: "/settings/password" },
      ],
    },
    {
      title: "Security",
      description: "Manage your security settings and backup keys",
      icon: Lock,
      items: [
        { name: "Two-Factor Authentication", href: "/settings/2fa" },
        { name: "Backup Recovery Keys", href: "/settings/backup" },
        { name: "Connected Wallets", href: "/settings/wallets" },
      ],
    },
    {
      title: "Notifications",
      description: "Manage how you receive notifications",
      icon: Bell,
      items: [
        { name: "Email Notifications", href: "/settings/notifications/email" },
        { name: "Push Notifications", href: "/settings/notifications/push" },
        { name: "Wallet Alerts", href: "/settings/notifications/wallet" },
      ],
    },
    {
      title: "Billing",
      description: "Manage your subscription and payment methods",
      icon: CreditCard,
      items: [
        { name: "Subscription", href: "/settings/billing/subscription" },
        { name: "Payment Methods", href: "/settings/billing/payment" },
        { name: "Billing History", href: "/settings/billing/history" },
      ],
    },
    {
      title: "Legal",
      description: "Manage your legal documents and will",
      icon: FileText,
      items: [
        { name: "Digital Will", href: "/settings/legal/will" },
        { name: "Power of Attorney", href: "/settings/legal/poa" },
        { name: "Terms & Conditions", href: "/settings/legal/terms" },
      ],
    },
    {
      title: "API",
      description: "Manage your API keys and integrations",
      icon: Key,
      items: [
        { name: "API Keys", href: "/settings/api/keys" },
        { name: "Webhooks", href: "/settings/api/webhooks" },
        { name: "Integrations", href: "/settings/api/integrations" },
      ],
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <Separator />
        <div className="grid gap-6 md:grid-cols-2">
          {settingsCategories.map((category) => (
            <Card key={category.title}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-md bg-primary/10 p-2">
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.items.map((item) => (
                    <li key={item.name}>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link href={item.href}>{item.name}</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

