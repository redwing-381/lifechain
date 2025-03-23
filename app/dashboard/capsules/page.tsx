"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Archive, Clock, Eye, Filter, Lock, MoreHorizontal, Search, Users } from "lucide-react"
import Web3 from "web3"
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

const CONTRACT_ADDRESS = "0xf3f655eBF7f62c74EA88bcb14d6230042e7A8C74"
const CONTRACT_ABI =[
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "CapsuleCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "UserLoggedIn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "UserRegistered",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "capsuleCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "capsules",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "threshold",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      },
      {
        "internalType": "address[]",
        "name": "_trustees",
        "type": "address[]"
      },
      {
        "internalType": "uint256",
        "name": "_threshold",
        "type": "uint256"
      }
    ],
    "name": "createCapsule",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getUserCapsules",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "login",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "users",
    "outputs": [
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "lastLogin",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

declare global {
  interface Window {
    ethereum?: any
  }
}

interface Capsule {
  id: string
  name: string
  description: string
  status: "active" | "pending"
  created: string
  size: string
  trustees: number
  approvals: number
  ipfsHash: string
}

export default function CapsulesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [capsules, setCapsules] = useState<Capsule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [web3, setWeb3] = useState<Web3 | null>(null)
  const [contract, setContract] = useState<any>(null)
  const [account, setAccount] = useState<string>("")

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        if (typeof window.ethereum === "undefined") throw new Error("Please install MetaMask")
        
        const web3Instance = new Web3(window.ethereum)
        setWeb3(web3Instance)
        
        const accounts = await web3Instance.eth.requestAccounts()
        setAccount(accounts[0])
        
        const contractInstance = new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS)
        setContract(contractInstance)
        await fetchCapsules(contractInstance, accounts[0])
      } catch (err: any) {
        setError(err.message || "Failed to connect to wallet")
        setLoading(false)
      }
    }
    initializeWeb3()
  }, [])

  const fetchCapsules = async (contract: any, account: string) => {
    try {
      const userCapsules = await contract.methods.getUserCapsules(account).call()
      
      const capsulesData = await Promise.all(
        userCapsules.map(async (id: string) => {
          const capsule = await contract.methods.capsules(id).call()
          return {
            id: id.toString(),
            name: capsule.name,
            description: capsule.description,
            status: capsule.threshold > 0 ? "pending" : "active",
            created: new Date(Number(capsule.createdAt) * 1000).toLocaleDateString(),
            size: "IPFS",
            // Fix trustees array access
            trustees: capsule.trustees ? capsule.trustees.length : 0,
            approvals: 0,
            ipfsHash: capsule.ipfsHash
          }
        })
      )
      
      setCapsules(capsulesData)
      setLoading(false)
    } catch (err) {
      console.error("Failed to fetch capsules:", err)
      setError("Failed to load capsules")
      setLoading(false)
    }
  }

  const filteredCapsules = capsules.filter((capsule) => {
    const matchesSearch =
      capsule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      capsule.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || capsule.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-destructive">{error}</div>
        </div>
      </DashboardLayout>
    )
  }

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
                    {filteredCapsules.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          No capsules found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCapsules.map((capsule) => (
                        <TableRow key={capsule.id}>
                          <TableCell>
                            <div className="font-medium">{capsule.name}</div>
                            <div className="text-sm text-muted-foreground hidden sm:block">
                              {capsule.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={capsule.status === "active" ? "default" : "secondary"}
                              className="flex items-center gap-1 w-fit"
                            >
                              {capsule.status === "active" ? (
                                <Lock className="h-3 w-3" />
                              ) : (
                                <Clock className="h-3 w-3" />
                              )}
                              <span className="capitalize">{capsule.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {capsule.created}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline" className="font-mono">
                              {capsule.size}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              {capsule.trustees}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/dashboard/capsules/${capsule.id}`}>
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
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => navigator.clipboard.writeText(capsule.ipfsHash)}
                                  >
                                    Copy IPFS Hash
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    Delete Capsule
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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
              <CardContent>
                {/* Implement active-only filtering */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="mt-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>Pending Capsules</CardTitle>
                <CardDescription>Capsules waiting for trustee approvals</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Implement pending-only filtering */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}