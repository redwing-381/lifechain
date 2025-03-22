"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, FileText, Upload, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/dashboard-layout"

export default function CreateCapsulePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [capsuleData, setCapsuleData] = useState({
    name: "",
    description: "",
    files: [] as File[],
    trustees: [] as string[],
    threshold: 3,
    newTrustee: "",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCapsuleData({
        ...capsuleData,
        files: [...Array.from(e.target.files)],
      })
    }
  }

  const handleAddTrustee = () => {
    if (capsuleData.newTrustee.trim()) {
      setCapsuleData({
        ...capsuleData,
        trustees: [...capsuleData.trustees, capsuleData.newTrustee.trim()],
        newTrustee: "",
      })
    }
  }

  const handleRemoveTrustee = (index: number) => {
    setCapsuleData({
      ...capsuleData,
      trustees: capsuleData.trustees.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would create the capsule
    router.push("/dashboard/capsules")
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="files">Upload Files</Label>
                    <div className="border border-dashed border-input rounded-md p-6 text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Drag and drop files here or click to browse</p>
                      <Input id="files" type="file" multiple className="hidden" onChange={handleFileChange} />
                      <Button type="button" variant="outline" onClick={() => document.getElementById("files")?.click()}>
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
                    <Label htmlFor="trustees">Add Trustees</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="trustees"
                        value={capsuleData.newTrustee}
                        onChange={(e) => setCapsuleData({ ...capsuleData, newTrustee: e.target.value })}
                        placeholder="Email or wallet address"
                      />
                      <Button type="button" onClick={handleAddTrustee}>
                        Add
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add people you trust to approve access to this capsule
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
                              <span className="text-sm">{trustee}</span>
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveTrustee(index)}>
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
                    <Tabs defaultValue="number" className="w-full">
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
                              setCapsuleData({ ...capsuleData, threshold: Number.parseInt(e.target.value) })
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            Number of trustees that must approve to grant access ({capsuleData.threshold} out of{" "}
                            {capsuleData.trustees.length})
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
                              const percentage = Number.parseInt(e.target.value)
                              const newThreshold = Math.max(
                                1,
                                Math.round((percentage / 100) * capsuleData.trustees.length),
                              )
                              setCapsuleData({ ...capsuleData, threshold: newThreshold })
                            }}
                          />
                          <p className="text-xs text-muted-foreground">
                            Percentage of trustees that must approve to grant access
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
                            <dd className="text-sm">{capsuleData.trustees.length} people</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium">Threshold:</dt>
                            <dd className="text-sm">{capsuleData.threshold} approvals required</dd>
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
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            ) : (
              <div></div>
            )}
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)}>Next</Button>
            ) : (
              <Button type="submit" onClick={handleSubmit}>
                Create Capsule
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}

