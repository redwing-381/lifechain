"use client"

import { useState } from "react"
import Link from "next/link"
import { Archive, Clock, Eye, Filter, Lock, MoreHorizontal, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/dashboard-layout"

// Mock data for capsules
const capsules = [
  {
    id: "cap-1",
    name: "Family Photos",
    description: "Collection of family photos from 2010-2020",
    status: "active",
    created: "2023-10-15",
    size: "250 MB",
    trustees: 5,
    approvals: 0,
  },
  {
    id: "cap-2",
    name: "Financial Documents",
    description: "Important financial records and statements",
    status: "pending",
    created: "2023-11-20",
    size: "120 MB",
    trustees: 3,
    approvals: 1,
  },
  {
    id: "cap-3",
    name: "Personal Letters",
    description: "Personal letters and correspondence",
    status: "active",
    created: "2023-09-05",
    size: "50 MB",
    trustees: 4,
    approvals: 0,
  },
  {
    id: "cap-4",
    name: "Business Documents",
    description: "Business contracts and agreements",
    status: "pending",
    created: "2024-01-10",
    size: "300 MB",
    trustees: 2,
    approvals: 2,
  },
  {
    id: "cap-5",
    name: "Video Messages",
    description: "Video messages for loved ones",
    status: "active",
    created: "2024-02-15",
    size: "500 MB",
    trustees: 3,
    approvals: 0,
  },
]

export default function CapsulesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredCapsules = capsules.filter((capsule) => {
    const matchesSearch =
      capsule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      capsule.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || capsule.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Your Capsules</h2>
            <p className="text-muted-foreground">Manage and view all your digital legacy capsules</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/create-capsule">
              <Archive className="mr-2 h-4 w-4" />
              Create Capsule
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList>
              <TabsTrigger value="all">All Capsules</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search capsules..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active Only</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending Only</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>All Capsules</CardTitle>
                <CardDescription>
                  Showing {filteredCapsules.length} of {capsules.length} capsules
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Created</TableHead>
                      <TableHead className="hidden md:table-cell">Size</TableHead>
                      <TableHead className="hidden md:table-cell">Trustees</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCapsules.map((capsule) => (
                      <TableRow key={capsule.id}>
                        <TableCell>
                          <div className="font-medium">{capsule.name}</div>
                          <div className="text-sm text-muted-foreground hidden sm:block">{capsule.description}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={capsule.status === "active" ? "default" : "secondary"}>
                            {capsule.status === "active" ? (
                              <Lock className="mr-1 h-3 w-3" />
                            ) : (
                              <Clock className="mr-1 h-3 w-3" />
                            )}
                            {capsule.status === "active" ? "Active" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(capsule.created).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{capsule.size}</TableCell>
                        <TableCell className="hidden md:table-cell">{capsule.trustees}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/capsule/${capsule.id}`}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Link>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">More</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                <DropdownMenuItem>Manage Trustees</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">Delete Capsule</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="mt-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>Active Capsules</CardTitle>
                <CardDescription>Capsules that are active and secured</CardDescription>
              </CardHeader>
              <CardContent>{/* Similar table structure for active capsules */}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="mt-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>Pending Capsules</CardTitle>
                <CardDescription>Capsules waiting for trustee approvals</CardDescription>
              </CardHeader>
              <CardContent>{/* Similar table structure for pending capsules */}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

