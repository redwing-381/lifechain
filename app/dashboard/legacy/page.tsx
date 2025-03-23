"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, FileText, Plus, Shield, User, Users } from "lucide-react"
import Web3 from "web3"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { toast } from "@/components/ui/use-toast"

// Contract address - you would replace this with your deployed contract address
const CONTRACT_ADDRESS = "0xa1b48d408b1B89885ab11857A27Ba1c49eac0d60"

// ABI generated from the Solidity contract
const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "wallet",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "relationship",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isTrustee",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isHeir",
        "type": "bool"
      }
    ],
    "name": "MemberAdded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "wallet",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "relationship",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isTrustee",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isHeir",
        "type": "bool"
      }
    ],
    "name": "addMember",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllMembers",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "relationship",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isTrustee",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isHeir",
            "type": "bool"
          }
        ],
        "internalType": "struct LegacyManager.Member[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "wallet",
        "type": "address"
      }
    ],
    "name": "isMember",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
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
    "name": "memberAddresses",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
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
    "name": "members",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "relationship",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isTrustee",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isHeir",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

// Type definition for a Member
interface Member {
  name: string
  relationship: string
  isTrustee: boolean
  isHeir: boolean
  wallet: string
}

// Instead of extending Window, use this approach for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function LegacyPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [newMember, setNewMember] = useState({
    name: "",
    relationship: "",
    wallet: "",
    isTrustee: false,
    isHeir: false,
  })
  const [web3, setWeb3] = useState<Web3 | null>(null)
  const [contract, setContract] = useState<any>(null)
  const [account, setAccount] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (!window.ethereum) {
        toast({ title: "Error", description: "Please install MetaMask" })
        setLoading(false)
        return
      }

      try {
        const web3Instance = new Web3(window.ethereum)
        await window.ethereum.request({ method: "eth_requestAccounts" })
        const accounts = await web3Instance.eth.getAccounts()
        
        setWeb3(web3Instance)
        setAccount(accounts[0])
        
        const contractInstance = new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS)
        setContract(contractInstance)
        await fetchMembers(contractInstance, accounts[0])
      } catch (err) {
        console.error("Initialization error:", err)
        toast({ title: "Error", description: "Failed to connect to blockchain" })
      }
      setLoading(false)
    }

    initializeWeb3()
  }, [])

  const fetchMembers = async (contractInstance: any, currentAccount: string) => {
    try {
      // Get all member addresses
      const memberCount = await contractInstance.methods.getAllMembers().call({ from: currentAccount })
      
      // Format the members with their wallet addresses
      let formattedMembers: Member[] = []
      
      for (let i = 0; i < memberCount.length; i++) {
        const memberAddress = await contractInstance.methods.memberAddresses(i).call({ from: currentAccount })
        formattedMembers.push({
          name: memberCount[i].name,
          relationship: memberCount[i].relationship,
          isTrustee: memberCount[i].isTrustee,
          isHeir: memberCount[i].isHeir,
          wallet: memberAddress
        })
      }
      
      setMembers(formattedMembers)
    } catch (err) {
      console.error("Fetch error:", err)
      toast({ title: "Error", description: "Failed to load members" })
    }
  }

  const handleAddMember = async () => {
    if (!web3?.utils.isAddress(newMember.wallet)) {
      toast({ title: "Invalid Address", description: "Please enter a valid wallet address" })
      return
    }

    if (!newMember.name || !newMember.relationship) {
      toast({ title: "Missing Information", description: "Please fill in all required fields" })
      return
    }

    try {
      setLoading(true)
      await contract.methods.addMember(
        newMember.wallet,
        newMember.name,
        newMember.relationship,
        newMember.isTrustee,
        newMember.isHeir
      ).send({ from: account })

      toast({ title: "Success", description: "Member added successfully" })
      setNewMember({
        name: "",
        relationship: "",
        wallet: "",
        isTrustee: false,
        isHeir: false,
      })
      setIsDialogOpen(false)
      await fetchMembers(contract, account)
    } catch (err) {
      console.error("Add member error:", err)
      toast({ title: "Error", description: "Failed to add member" })
    } finally {
      setLoading(false)
    }
  }

  const getTruncatedAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Legacy Management</h2>
            <p className="text-muted-foreground">Manage your heirs and trustees for your digital legacy</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                  Add a wallet address to your legacy plan
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
                  <Label htmlFor="wallet">Wallet Address</Label>
                  <Input
                    id="wallet"
                    value={newMember.wallet}
                    onChange={(e) => setNewMember({ ...newMember, wallet: e.target.value })}
                    placeholder="0x..."
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
                    Make this address a trustee
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
                    Make this address an heir
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddMember} disabled={loading}>
                  {loading ? 'Adding...' : 'Add Address'}
                </Button>
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
                {members.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No members added yet. Add your first person to get started.
                  </div>
                ) : (
                  members.map((member) => (
                    <div key={member.wallet} className="flex items-center justify-between rounded-md border p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.relationship}</p>
                          <p className="text-xs font-mono text-muted-foreground">{getTruncatedAddress(member.wallet)}</p>
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
                  ))
                )}
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
                    <span className="text-sm">{members.filter(m => m.isTrustee).length}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Heirs</span>
                    </div>
                    <span className="text-sm">{members.filter(m => m.isHeir).length}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Capsules</span>
                    </div>
                    <span className="text-sm">0</span>
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