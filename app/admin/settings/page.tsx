"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = () => {
    setIsLoading(true)

    // Simulate saving settings
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Settings</h1>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="dark:text-white">Store Information</CardTitle>
                <CardDescription>Basic information about your store</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName" className="dark:text-white">
                    Store Name
                  </Label>
                  <Input id="storeName" defaultValue="Mobile Shop" className="dark:bg-gray-800 dark:border-gray-700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail" className="dark:text-white">
                    Store Email
                  </Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    defaultValue="contact@mobileshop.com"
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone" className="dark:text-white">
                    Store Phone
                  </Label>
                  <Input
                    id="storePhone"
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress" className="dark:text-white">
                    Store Address
                  </Label>
                  <Textarea
                    id="storeAddress"
                    defaultValue="123 Main St, New York, NY 10001, USA"
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="dark:text-white">SEO Settings</CardTitle>
                <CardDescription>Optimize your store for search engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle" className="dark:text-white">
                    Meta Title
                  </Label>
                  <Input
                    id="metaTitle"
                    defaultValue="Mobile Shop - Premium Mobile Products"
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription" className="dark:text-white">
                    Meta Description
                  </Label>
                  <Textarea
                    id="metaDescription"
                    defaultValue="Shop the latest mobile products at Mobile Shop. We offer a wide range of smartphones, accessories, and more."
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="store">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="dark:text-white">Product Settings</CardTitle>
                <CardDescription>Configure how products are displayed and managed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">Show out of stock products</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Display products that are currently out of stock
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">Enable product reviews</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Allow customers to leave reviews on products
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">Enable product ratings</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow customers to rate products</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">Show related products</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Display related products on product pages
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="dark:text-white">Inventory Management</CardTitle>
                <CardDescription>Configure inventory settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">Track inventory</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Keep track of product inventory levels</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">Low stock notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications when products are low in stock
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold" className="dark:text-white">
                    Low Stock Threshold
                  </Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    defaultValue="5"
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payment">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="dark:text-white">Payment Methods</CardTitle>
                <CardDescription>Configure available payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">Credit/Debit Cards</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Accept payments via credit and debit cards
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">PayPal</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Accept payments via PayPal</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">Apple Pay</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Accept payments via Apple Pay</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">Google Pay</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Accept payments via Google Pay</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="dark:text-white">Currency Settings</CardTitle>
                <CardDescription>Configure currency options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency" className="dark:text-white">
                    Default Currency
                  </Label>
                  <select
                    id="defaultCurrency"
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">Show currency symbol</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Display currency symbol before prices</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="shipping">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="dark:text-white">Shipping Methods</CardTitle>
                <CardDescription>Configure available shipping methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">Standard Shipping</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">3-5 business days</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="standardShippingRate" className="dark:text-white">
                    Standard Shipping Rate ($)
                  </Label>
                  <Input
                    id="standardShippingRate"
                    type="number"
                    defaultValue="5.99"
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">Express Shipping</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">1-2 business days</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expressShippingRate" className="dark:text-white">
                    Express Shipping Rate ($)
                  </Label>
                  <Input
                    id="expressShippingRate"
                    type="number"
                    defaultValue="12.99"
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">Free Shipping</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">For orders above a certain amount</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold" className="dark:text-white">
                    Free Shipping Threshold ($)
                  </Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    defaultValue="50"
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="dark:text-white">Email Notifications</CardTitle>
                <CardDescription>Configure email notifications for different events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">New Order</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive email when a new order is placed</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">Order Status Update</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive email when an order status changes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">Low Stock Alert</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive email when a product is low in stock
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">New Customer Registration</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive email when a new customer registers
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="dark:text-white">Push Notifications</CardTitle>
                <CardDescription>Configure push notifications for the admin app</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">Enable Push Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive push notifications on your device
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">New Order Notification</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notification for new orders</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">Low Stock Notification</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive push notification for low stock alerts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
