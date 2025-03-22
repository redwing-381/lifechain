"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, FileText, Plus, Shield, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DashboardLayout from "@/components/dashboard-layout"

// Mock data for family tree
const familyMembers = [
  {
    id: 1,
    name: "You",
    relationship: "Self",
    email: "you@example.com",
    isTrustee: false,
    isHeir: false,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    relationship: "Spouse",
    email: "sarah@example.com",
    isTrustee: true,
    isHeir: true,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Michael Chen",
    relationship: "Brother",
    email: "michael@example.com",
    isTrustee: true,
    isHeir: false,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Emma Johnson",
    relationship: "Daughter",
    email: "emma@example.com",
    isTrustee: false,
    isHeir: true,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Lisa Wong",
    relationship: "Friend",
    email: "lisa@example.com",
    isTrustee: true,
    isHeir: false,
    image: "/placeholder.svg?height=40&width=40",
  },
]

export default function LegacyPage() {
  const [newMember, setNewMember] = useState({
    name: "",
    relationship: "",
    email: "",
    isTrustee: false,
    isHeir: false,
  })

  const handleAddMember = () => {
    // In a real app, this would add the member to the database
    console.log("Adding member:", newMember)
    // Reset form
    setNewMember({
      name: "",
      relationship: "",
      email: "",
      isTrustee: false,
      isHeir: false,
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Legacy Management</h2>
            <p className="text-muted-foreground">Manage your heirs and trustees for your digital legacy</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Person
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Person to Legacy</DialogTitle>
                <DialogDescription>
                  Add a family member, friend, or trusted individual to your legacy plan.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    value={newMember.relationship}
                    onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
                    placeholder="Spouse, Child, Friend, etc."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="name@example.com"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="trustee"
                    checked={newMember.isTrustee}
                    onChange={(e) => setNewMember({ ...newMember, isTrustee: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="trustee" className="text-sm font-normal">
                    Make this person a trustee (can approve access requests)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="heir"
                    checked={newMember.isHeir}
                    onChange={(e) => setNewMember({ ...newMember, isHeir: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="heir" className="text-sm font-normal">
                    Make this person an heir (will inherit your digital assets)
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>
                  Cancel
                </Button>
                <Button onClick={handleAddMember}>Add Person</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Family & Trusted Individuals</CardTitle>
              <CardDescription>People who are part of your digital legacy plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {familyMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded-md border p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.image} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.relationship}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.isTrustee && (
                        <div className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                          Trustee
                        </div>
                      )}
                      {member.isHeir && (
                        <div className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-600">
                          Heir
                        </div>
                      )}
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Legacy Summary</CardTitle>
                <CardDescription>Overview of your legacy plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Trustees</span>
                    </div>
                    <span className="text-sm">{familyMembers.filter((m) => m.isTrustee).length}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Heirs</span>
                    </div>
                    <span className="text-sm">{familyMembers.filter((m) => m.isHeir).length}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Capsules</span>
                    </div>
                    <span className="text-sm">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Legal Documents</CardTitle>
                <CardDescription>Your legal documents and will</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Digital Will</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Power of Attorney</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/settings/legal">Manage Legal Documents</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

