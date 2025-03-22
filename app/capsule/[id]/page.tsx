"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Check, Clock, FileText, Lock, Shield, ThumbsUp, Users, Unlock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import DashboardLayout from "@/components/dashboard-layout"

// Mock data for a single capsule
const capsuleData = {
  id: "cap-2",
  name: "Financial Documents",
  description:
    "Important financial records and statements including tax returns, investment accounts, and insurance policies.",
  status: "pending",
  created: "2023-11-20",
  size: "120 MB",
  files: [
    { name: "tax_returns_2022.pdf", size: "2.4 MB", type: "application/pdf" },
    { name: "investments_summary.xlsx", size: "1.8 MB", type: "application/excel" },
    { name: "insurance_policies.pdf", size: "3.2 MB", type: "application/pdf" },
    { name: "retirement_accounts.pdf", size: "2.1 MB", type: "application/pdf" },
  ],
  trustees: [
    { id: 1, name: "Sarah Johnson", email: "sarah@example.com", approved: true },
    { id: 2, name: "Michael Chen", email: "michael@example.com", approved: false },
    { id: 3, name: "Lisa Wong", email: "lisa@example.com", approved: false },
  ],
  threshold: 2,
  blockchain: {
    address: "0x1a2b3c4d5e6f7g8h9i0j",
    network: "Ethereum",
    lastUpdated: "2024-03-10",
  },
}

export default function CapsulePage({ params }: { params: { id: string } }) {
  const [isApproving, setIsApproving] = useState(false)
  const [isApproved, setIsApproved] = useState(false)

  const approvalCount = capsuleData.trustees.filter((t) => t.approved).length + (isApproved ? 1 : 0)
  const approvalPercentage = (approvalCount / capsuleData.threshold) * 100

  const handleApprove = () => {
    setIsApproving(true)
    // Simulate API call
    setTimeout(() => {
      setIsApproved(true)
      setIsApproving(false)
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/capsules">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h2 className="text-2xl font-bold tracking-tight">{capsuleData.name}</h2>
            <Badge variant={capsuleData.status === "active" ? "default" : "secondary"}>
              {capsuleData.status === "active" ? <Lock className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
              {capsuleData.status === "active" ? "Active" : "Pending"}
            </Badge>
          </div>
          <div className="flex gap-2">
            {!isApproved && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Approve Access
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Approve Access Request</DialogTitle>
                    <DialogDescription>
                      You are about to approve access to this capsule. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      By approving, you confirm that the requestor should be granted access to the contents of this
                      capsule when the threshold is met.
                    </p>
                    <div className="rounded-md bg-muted p-4">
                      <h4 className="font-medium mb-2">Capsule Information</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span>{capsuleData.name}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Created:</span>
                          <span>{new Date(capsuleData.created).toLocaleDateString()}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Files:</span>
                          <span>{capsuleData.files.length} files</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {}}>
                      Cancel
                    </Button>
                    <Button onClick={handleApprove} disabled={isApproving}>
                      {isApproving ? "Processing..." : "Confirm Approval"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            <Button variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Capsule Information</CardTitle>
              <CardDescription>Details about this digital legacy capsule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Description</h3>
                <p className="text-sm text-muted-foreground">{capsuleData.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Created</h3>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {new Date(capsuleData.created).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Size</h3>
                  <div className="flex items-center text-sm">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    {capsuleData.size}
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-2">Blockchain Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address:</span>
                    <span className="font-mono">{capsuleData.blockchain.address.substring(0, 10)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network:</span>
                    <span>{capsuleData.blockchain.network}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span>{new Date(capsuleData.blockchain.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access Approval Status</CardTitle>
              <CardDescription>
                {approvalCount} of {capsuleData.threshold} required approvals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {approvalCount}/{capsuleData.threshold}
                  </span>
                </div>
                <Progress value={approvalPercentage} className="h-2" />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Trustees</h3>
                <div className="space-y-2">
                  {capsuleData.trustees.map((trustee) => (
                    <div key={trustee.id} className="flex items-center justify-between rounded-md border p-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={trustee.name} />
                          <AvatarFallback>{trustee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{trustee.name}</p>
                          <p className="text-xs text-muted-foreground">{trustee.email}</p>
                        </div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded-full ${trustee.approved ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                            >
                              {trustee.approved && <Check className="h-3 w-3" />}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>{trustee.approved ? "Approved" : "Not approved"}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))}
                  {isApproved && (
                    <div className="flex items-center justify-between rounded-md border p-2 bg-green-50">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt="You" />
                          <AvatarFallback>Y</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">You</p>
                          <p className="text-xs text-muted-foreground">Your approval</p>
                        </div>
                      </div>
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <Check className="h-3 w-3" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {approvalCount >= capsuleData.threshold ? (
                <Button className="w-full" variant="default">
                  <Unlock className="mr-2 h-4 w-4" />
                  Access Content
                </Button>
              ) : (
                <div className="text-center w-full text-sm text-muted-foreground">
                  <Users className="inline-block mr-2 h-4 w-4" />
                  Waiting for {capsuleData.threshold - approvalCount} more approval(s)
                </div>
              )}
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Capsule Contents</CardTitle>
            <CardDescription>Files stored in this digital legacy capsule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-3 gap-4 p-4 font-medium text-sm">
                <div>Name</div>
                <div>Type</div>
                <div>Size</div>
              </div>
              <Separator />
              {capsuleData.files.map((file, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 p-4 text-sm items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{file.name}</span>
                  </div>
                  <div>{file.type.split("/")[1].toUpperCase()}</div>
                  <div>{file.size}</div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Content is encrypted and stored securely on IPFS and blockchain
            </p>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}

