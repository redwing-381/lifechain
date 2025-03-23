// app/dashboard/capsules/create/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, FileText, Upload, Users } from "lucide-react"
import Web3 from "web3"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/dashboard-layout"

declare global {
  interface Window {
    ethereum?: any
  }
}

const CONTRACT_ADDRESS = "0xf3f655eBF7f62c74EA88bcb14d6230042e7A8C74";
const CONTRACT_ABI = [
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
];
const uploadToIPFS = async (files: File[]) => {
  try {
    const formData = new FormData()
    // Append each file with the same field name
    files.forEach(file => formData.append('file', file, file.name))

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || "IPFS upload failed")
    }

    return data.ipfsHash
  } catch (err: any) {
    console.error("IPFS upload error:", err)
    throw new Error("Failed to upload files to IPFS: " + err.message)
  }
}
export default function CreateCapsulePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [web3, setWeb3] = useState<Web3 | null>(null)
  const [contract, setContract] = useState<any>(null)
  const [account, setAccount] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [capsuleData, setCapsuleData] = useState({
    name: "",
    description: "",
    files: [] as File[],
    trustees: [] as string[],
    threshold: 1,
    newTrustee: "",
  })

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const web3Instance = new Web3(window.ethereum)
          setWeb3(web3Instance)
          
          const accounts = await web3Instance.eth.requestAccounts()
          setAccount(accounts[0])
          
          const contractInstance = new web3Instance.eth.Contract(
            CONTRACT_ABI,
            CONTRACT_ADDRESS
          )
          setContract(contractInstance)
        } catch (err) {
          setError("Please connect your wallet first")
        }
      } else {
        setError("Please install MetaMask")
      }
    }
    initializeWeb3()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCapsuleData({
        ...capsuleData,
        files: [...Array.from(e.target.files)],
      })
    }
  }

  const validateAddress = (address: string) => {
    return Web3.utils.isAddress(address)
  }

  const handleAddTrustee = () => {
    const address = capsuleData.newTrustee.trim()
    if (!address) return
    
    if (!validateAddress(address)) {
      setError("Invalid Ethereum address")
      return
    }

    setCapsuleData({
      ...capsuleData,
      trustees: [...capsuleData.trustees, Web3.utils.toChecksumAddress(address)],
      newTrustee: "",
    })
    setError("")
  }

  const handleRemoveTrustee = (index: number) => {
    setCapsuleData({
      ...capsuleData,
      trustees: capsuleData.trustees.filter((_, i) => i !== index),
    })
  }

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate inputs
      if (!capsuleData.name.trim()) throw new Error("Capsule name is required")
      if (capsuleData.files.length === 0) throw new Error("Please upload at least one file")
      if (capsuleData.trustees.length === 0) throw new Error("Please add at least one trustee")
      if (capsuleData.threshold < 1 || capsuleData.threshold > capsuleData.trustees.length) {
        throw new Error("Invalid approval threshold")
      }

      // Upload files to IPFS
      const ipfsHash = await uploadToIPFS(capsuleData.files)
      console.log("Uploaded to IPFS:", ipfsHash) // For debugging

      // Create capsule on blockchain
      await contract.methods.createCapsule(
        capsuleData.name,
        capsuleData.description,
        ipfsHash,
        capsuleData.trustees,
        capsuleData.threshold
      ).send({ from: account })

      router.push("/dashboard/capsules")
    } catch (err: any) {
      console.error("Capsule creation failed:", err)
      setError(err.message || "Failed to create capsule")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Create New Capsule</CardTitle>
            <CardDescription>Store your digital legacy securely with blockchain technology</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? "bg-primary text-primary-foreground" : "border border-input"}`}
                  >
                    {step > 1 ? <Check className="h-4 w-4" /> : "1"}
                  </div>
                  <span className="text-sm font-medium">Upload Content</span>
                </div>
                <div className="h-px flex-1 bg-border mx-4" />
                <div className="flex items-center space-x-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? "bg-primary text-primary-foreground" : "border border-input"}`}
                  >
                    {step > 2 ? <Check className="h-4 w-4" /> : "2"}
                  </div>
                  <span className="text-sm font-medium">Assign Trustees</span>
                </div>
                <div className="h-px flex-1 bg-border mx-4" />
                <div className="flex items-center space-x-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? "bg-primary text-primary-foreground" : "border border-input"}`}
                  >
                    {step > 3 ? <Check className="h-4 w-4" /> : "3"}
                  </div>
                  <span className="text-sm font-medium">Set Conditions</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Capsule Name</Label>
                    <Input
                      id="name"
                      value={capsuleData.name}
                      onChange={(e) => setCapsuleData({ ...capsuleData, name: e.target.value })}
                      placeholder="e.g., Family Photos, Financial Documents"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={capsuleData.description}
                      onChange={(e) => setCapsuleData({ ...capsuleData, description: e.target.value })}
                      placeholder="Describe the contents and purpose of this capsule"
                      rows={3}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="files">Upload Files</Label>
                    <div className="border border-dashed border-input rounded-md p-6 text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Drag and drop files here or click to browse</p>
                      <Input 
                        id="files" 
                        type="file" 
                        multiple 
                        className="hidden" 
                        onChange={handleFileChange}
                        disabled={loading}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => document.getElementById("files")?.click()}
                        disabled={loading}
                      >
                        Select Files
                      </Button>
                    </div>
                    {capsuleData.files.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Selected Files:</p>
                        <ul className="space-y-1">
                          {capsuleData.files.map((file, index) => (
                            <li key={index} className="text-sm flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="trustees">Add Trustees (Ethereum addresses)</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="trustees"
                        value={capsuleData.newTrustee}
                        onChange={(e) => setCapsuleData({ ...capsuleData, newTrustee: e.target.value })}
                        placeholder="0x..."
                        disabled={loading}
                      />
                      <Button 
                        type="button" 
                        onClick={handleAddTrustee}
                        disabled={loading}
                      >
                        Add
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add Ethereum addresses of trusted parties
                    </p>
                  </div>
                  {capsuleData.trustees.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Trustees:</p>
                      <ul className="space-y-2">
                        {capsuleData.trustees.map((trustee, index) => (
                          <li key={index} className="flex items-center justify-between rounded-md border p-2">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-sm font-mono">{trustee}</span>
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveTrustee(index)}
                              disabled={loading}
                            >
                              Remove
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="threshold">Approval Threshold</Label>
                    <Tabs defaultValue="number">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="number">Number</TabsTrigger>
                        <TabsTrigger value="percentage">Percentage</TabsTrigger>
                      </TabsList>
                      <TabsContent value="number" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="threshold-number">Required Approvals</Label>
                          <Input
                            id="threshold-number"
                            type="number"
                            min={1}
                            max={capsuleData.trustees.length}
                            value={capsuleData.threshold}
                            onChange={(e) =>
                              setCapsuleData({ ...capsuleData, threshold: Number(e.target.value) })
                            }
                            disabled={loading}
                          />
                          <p className="text-xs text-muted-foreground">
                            {capsuleData.threshold} out of {capsuleData.trustees.length} trustees required
                          </p>
                        </div>
                      </TabsContent>
                      <TabsContent value="percentage" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="threshold-percentage">Required Percentage</Label>
                          <Input
                            id="threshold-percentage"
                            type="number"
                            min={1}
                            max={100}
                            value={Math.round((capsuleData.threshold / Math.max(1, capsuleData.trustees.length)) * 100)}
                            onChange={(e) => {
                              const percentage = Number(e.target.value)
                              const newThreshold = Math.max(
                                1,
                                Math.round((percentage / 100) * capsuleData.trustees.length),
                              )
                              setCapsuleData({ ...capsuleData, threshold: newThreshold })
                            }}
                            disabled={loading}
                          />
                          <p className="text-xs text-muted-foreground">
                            {Math.round((capsuleData.threshold / Math.max(1, capsuleData.trustees.length)) * 100)}% of trustees required
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                  <div className="space-y-2">
                    <Label>Summary</Label>
                    <Card>
                      <CardContent className="p-4">
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium">Capsule Name:</dt>
                            <dd className="text-sm">{capsuleData.name || "Untitled"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium">Files:</dt>
                            <dd className="text-sm">{capsuleData.files.length} files</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium">Trustees:</dt>
                            <dd className="text-sm">{capsuleData.trustees.length} addresses</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium">Threshold:</dt>
                            <dd className="text-sm">
                              {capsuleData.threshold} approval{capsuleData.threshold > 1 ? "s" : ""} required
                            </dd>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button 
                variant="outline" 
                onClick={() => setStep(step - 1)}
                disabled={loading}
              >
                Previous
              </Button>
            ) : (
              <div></div>
            )}
            {step < 3 ? (
              <Button 
                onClick={() => setStep(step + 1)}
                disabled={loading}
              >
                Next
              </Button>
            ) : (
              <Button 
                type="submit" 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Creating Capsule..." : "Create Capsule"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}