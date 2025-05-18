"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, CreditCard, MapPin, Truck, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import { ApplePayButton } from "@/components/apple-pay-button"
import { GooglePayButton } from "@/components/google-pay-button"
import { usePayment, type SavedAddress, type PaymentMethod } from "@/components/payment-provider"
import { SavedCardsSelector } from "@/components/saved-cards-selector"
import { AddressSelector } from "@/components/address-selector"
import { PaymentSecurityBadges } from "@/components/payment-security-badges"
import { CreditCardInput } from "@/components/credit-card-input"
import { useToast } from "@/components/ui/use-toast"

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showAddNewCard, setShowAddNewCard] = useState(false)
  const [showAddNewAddress, setShowAddNewAddress] = useState(false)
  const [newCardValid, setNewCardValid] = useState(false)
  const [newCardDetails, setNewCardDetails] = useState<any>(null)
  const [addressFormData, setAddressFormData] = useState<Partial<SavedAddress>>({
    firstName: "",
    lastName: "",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phoneNumber: "",
  })
  const router = useRouter()
  const { toast } = useToast()
  const {
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    addSavedCard,
    processPayment,
    savedAddresses,
    addSavedAddress,
  } = usePayment()

  // Auto-fill address form if we have a saved address
  useEffect(() => {
    if (savedAddresses.length > 0) {
      const defaultAddress = savedAddresses.find((addr) => addr.isDefault) || savedAddresses[0]
      setAddressFormData({
        firstName: defaultAddress.firstName,
        lastName: defaultAddress.lastName,
        streetAddress: defaultAddress.streetAddress,
        apartment: defaultAddress.apartment || "",
        city: defaultAddress.city,
        state: defaultAddress.state,
        zipCode: defaultAddress.zipCode,
        country: defaultAddress.country,
        phoneNumber: defaultAddress.phoneNumber,
      })
    }
  }, [savedAddresses])

  const handleNextStep = () => {
    setStep(step + 1)
    window.scrollTo(0, 0)
  }

  const handlePreviousStep = () => {
    setStep(step - 1)
    window.scrollTo(0, 0)
  }

  const handlePlaceOrder = async () => {
    setIsLoading(true)

    try {
      const result = await processPayment(1632.39)

      if (result.success) {
        toast({
          title: "Payment Successful",
          description: `Your payment has been processed successfully. Transaction ID: ${result.transactionId}`,
          variant: "default",
        })

        // Navigate to success page
        setTimeout(() => {
          router.push("/checkout/success")
        }, 1000)
      } else {
        setIsLoading(false)
        toast({
          title: "Payment Failed",
          description: result.error || "There was an error processing your payment. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setAddressFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSaveNewAddress = () => {
    // Validate address form
    const requiredFields = [
      "firstName",
      "lastName",
      "streetAddress",
      "city",
      "state",
      "zipCode",
      "country",
      "phoneNumber",
    ]
    const missingFields = requiredFields.filter((field) => !addressFormData[field as keyof typeof addressFormData])

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Add new address
    addSavedAddress(addressFormData as Omit<SavedAddress, "id" | "isDefault">)
    setShowAddNewAddress(false)
    toast({
      title: "Address Saved",
      description: "Your new address has been saved successfully.",
    })
  }

  const handleSaveNewCard = () => {
    if (!newCardValid || !newCardDetails) {
      toast({
        title: "Invalid Card Details",
        description: "Please check your card information and try again.",
        variant: "destructive",
      })
      return
    }

    // Add new card
    addSavedCard({
      cardNumber: newCardDetails.cardNumber,
      lastFourDigits: newCardDetails.cardNumber.slice(-4),
      expiryDate: newCardDetails.expiryDate,
      cardholderName: newCardDetails.cardholderName,
      brand: newCardDetails.brand,
    })

    setShowAddNewCard(false)
    setSelectedPaymentMethod("savedCard")
    toast({
      title: "Card Saved",
      description: "Your new card has been saved successfully.",
    })
  }

  const handleCardDetailsChange = (isValid: boolean, details: any) => {
    setNewCardValid(isValid)
    setNewCardDetails(details)
  }

  const handleSelectAddress = (address: SavedAddress) => {
    setAddressFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      streetAddress: address.streetAddress,
      apartment: address.apartment || "",
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phoneNumber: address.phoneNumber,
    })
  }

  const handleExpressCheckout = (result: { success: boolean; transactionId?: string; error?: string }) => {
    if (result.success) {
      toast({
        title: "Payment Successful",
        description: `Your payment has been processed successfully. Transaction ID: ${result.transactionId}`,
      })
      router.push("/checkout/success")
    } else {
      toast({
        title: "Payment Failed",
        description: result.error || "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <Link href="/cart" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowLeft size={24} className="dark:text-gray-200" />
          </Link>
          <h1 className="font-bold text-lg dark:text-white">Checkout</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? "bg-sky-500 text-white" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {step > 1 ? <Check size={16} /> : 1}
            </div>
            <span className="text-xs mt-1 dark:text-gray-300">Shipping</span>
          </div>
          <div className="flex-1 h-1 mx-2 bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-full ${step >= 2 ? "bg-sky-500" : "bg-gray-200 dark:bg-gray-700"}`}
              style={{ width: step > 1 ? "100%" : "0%" }}
            ></div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? "bg-sky-500 text-white" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {step > 2 ? <Check size={16} /> : 2}
            </div>
            <span className="text-xs mt-1 dark:text-gray-300">Payment</span>
          </div>
          <div className="flex-1 h-1 mx-2 bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-full ${step >= 3 ? "bg-sky-500" : "bg-gray-200 dark:bg-gray-700"}`}
              style={{ width: step > 2 ? "100%" : "0%" }}
            ></div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? "bg-sky-500 text-white" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              3
            </div>
            <span className="text-xs mt-1 dark:text-gray-300">Review</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h2 className="font-bold text-lg mb-4 flex items-center dark:text-white">
                <MapPin size={18} className="mr-2" />
                Shipping Address
              </h2>

              {!showAddNewAddress && savedAddresses.length > 0 && (
                <AddressSelector
                  onAddNewAddress={() => setShowAddNewAddress(true)}
                  onSelectAddress={handleSelectAddress}
                />
              )}

              {(showAddNewAddress || savedAddresses.length === 0) && (
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="dark:text-white">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={addressFormData.firstName}
                        onChange={handleAddressInputChange}
                        className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="dark:text-white">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={addressFormData.lastName}
                        onChange={handleAddressInputChange}
                        className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="streetAddress" className="dark:text-white">
                      Street Address
                    </Label>
                    <Input
                      id="streetAddress"
                      placeholder="123 Main St"
                      value={addressFormData.streetAddress}
                      onChange={handleAddressInputChange}
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apartment" className="dark:text-white">
                      Apartment, suite, etc. (optional)
                    </Label>
                    <Input
                      id="apartment"
                      placeholder="Apt 4B"
                      value={addressFormData.apartment}
                      onChange={handleAddressInputChange}
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="dark:text-white">
                        City
                      </Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        value={addressFormData.city}
                        onChange={handleAddressInputChange}
                        className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="dark:text-white">
                        State
                      </Label>
                      <Input
                        id="state"
                        placeholder="NY"
                        value={addressFormData.state}
                        onChange={handleAddressInputChange}
                        className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="dark:text-white">
                        ZIP Code
                      </Label>
                      <Input
                        id="zipCode"
                        placeholder="10001"
                        value={addressFormData.zipCode}
                        onChange={handleAddressInputChange}
                        className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="dark:text-white">
                        Country
                      </Label>
                      <Input
                        id="country"
                        placeholder="United States"
                        value={addressFormData.country}
                        onChange={handleAddressInputChange}
                        className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="dark:text-white">
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="(123) 456-7890"
                      value={addressFormData.phoneNumber}
                      onChange={handleAddressInputChange}
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      required
                    />
                  </div>

                  {showAddNewAddress && savedAddresses.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowAddNewAddress(false)}
                        className="flex-1 dark:border-gray-700 dark:text-white"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveNewAddress} className="flex-1">
                        Save Address
                      </Button>
                    </div>
                  )}
                </form>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h2 className="font-bold text-lg mb-4 flex items-center dark:text-white">
                <Truck size={18} className="mr-2" />
                Shipping Method
              </h2>
              <RadioGroup defaultValue="standard" className="space-y-3">
                <div className="flex items-center justify-between border rounded-md p-3 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="font-medium dark:text-white">
                      Standard Shipping
                    </Label>
                  </div>
                  <span className="font-medium dark:text-white">Free</span>
                </div>
                <div className="flex items-center justify-between border rounded-md p-3 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="font-medium dark:text-white">
                      Express Shipping
                    </Label>
                  </div>
                  <span className="font-medium dark:text-white">$12.99</span>
                </div>
              </RadioGroup>
            </div>

            <Button onClick={handleNextStep} className="w-full">
              Continue to Payment
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h2 className="font-bold text-lg mb-4 flex items-center dark:text-white">
                <CreditCard size={18} className="mr-2" />
                Payment Method
              </h2>
              <RadioGroup
                value={selectedPaymentMethod}
                onValueChange={(value) => setSelectedPaymentMethod(value as PaymentMethod)}
                className="space-y-3"
              >
                <div className="flex items-center justify-between border rounded-md p-3 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="savedCard" id="savedCard" />
                    <Label htmlFor="savedCard" className="font-medium dark:text-white">
                      Saved Cards
                    </Label>
                  </div>
                </div>
                <div className="flex items-center justify-between border rounded-md p-3 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="font-medium dark:text-white">
                      Credit / Debit Card
                    </Label>
                  </div>
                </div>
                <div className="flex items-center justify-between border rounded-md p-3 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="font-medium dark:text-white">
                      PayPal
                    </Label>
                  </div>
                </div>
                <div className="flex items-center justify-between border rounded-md p-3 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="applepay" id="applepay" />
                    <Label htmlFor="applepay" className="font-medium dark:text-white">
                      Apple Pay
                    </Label>
                  </div>
                </div>
                <div className="flex items-center justify-between border rounded-md p-3 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="googlepay" id="googlepay" />
                    <Label htmlFor="googlepay" className="font-medium dark:text-white">
                      Google Pay
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {selectedPaymentMethod === "savedCard" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <h2 className="font-bold text-lg mb-4 dark:text-white">Your Cards</h2>
                {showAddNewCard ? (
                  <div className="space-y-4">
                    <CreditCardInput onCardDetailsChange={handleCardDetailsChange} />
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowAddNewCard(false)}
                        className="flex-1 dark:border-gray-700 dark:text-white"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveNewCard} className="flex-1" disabled={!newCardValid}>
                        Save Card
                      </Button>
                    </div>
                  </div>
                ) : (
                  <SavedCardsSelector onAddNewCard={() => setShowAddNewCard(true)} />
                )}
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h2 className="font-bold text-lg mb-4 dark:text-white">Express Checkout</h2>
              <div className="space-y-3">
                <ApplePayButton amount={1632.39} onPaymentComplete={handleExpressCheckout} />
                <GooglePayButton amount={1632.39} onPaymentComplete={handleExpressCheckout} />
              </div>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or continue with selected payment
                  </span>
                </div>
              </div>
            </div>

            {selectedPaymentMethod === "card" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <h2 className="font-bold text-lg mb-4 dark:text-white">Card Details</h2>
                <CreditCardInput onCardDetailsChange={handleCardDetailsChange} />
                <PaymentSecurityBadges />
              </div>
            )}

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                className="flex-1 dark:border-gray-700 dark:text-white"
              >
                Back
              </Button>
              <Button onClick={handleNextStep} className="flex-1">
                Review Order
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h2 className="font-bold text-lg mb-4 dark:text-white">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">PEUGEOT - LR01 × 1</span>
                  <span className="font-medium dark:text-white">$1,999.99</span>
                </div>
                <div className="flex justify-between py-2 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">SMITH - Trade × 1</span>
                  <span className="font-medium dark:text-white">$120.00</span>
                </div>
                <div className="flex justify-between py-2 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium dark:text-white">$2,119.99</span>
                </div>
                <div className="flex justify-between py-2 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-medium dark:text-white">Free</span>
                </div>
                <div className="flex justify-between py-2 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Discount (30%)</span>
                  <span className="font-medium text-green-600 dark:text-green-400">-$636.00</span>
                </div>
                <div className="flex justify-between py-2 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="font-medium dark:text-white">$148.40</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-bold dark:text-white">Total</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">$1,632.39</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h2 className="font-bold text-lg mb-2 dark:text-white">Shipping Address</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {addressFormData.firstName} {addressFormData.lastName}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {addressFormData.streetAddress}
                {addressFormData.apartment && `, ${addressFormData.apartment}`}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {addressFormData.city}, {addressFormData.state} {addressFormData.zipCode}
              </p>
              <p className="text-gray-600 dark:text-gray-400">{addressFormData.country}</p>
              <p className="text-gray-600 dark:text-gray-400">{addressFormData.phoneNumber}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h2 className="font-bold text-lg mb-2 dark:text-white">Payment Method</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedPaymentMethod === "card" && "Credit Card"}
                {selectedPaymentMethod === "savedCard" && "Saved Card ending in 1111"}
                {selectedPaymentMethod === "paypal" && "PayPal"}
                {selectedPaymentMethod === "applepay" && "Apple Pay"}
                {selectedPaymentMethod === "googlepay" && "Google Pay"}
              </p>
            </div>

            <PaymentSecurityBadges />

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                className="flex-1 dark:border-gray-700 dark:text-white"
              >
                Back
              </Button>
              <Button onClick={handlePlaceOrder} className="flex-1" disabled={isLoading}>
                {isLoading ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
