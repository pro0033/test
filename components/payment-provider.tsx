"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"

export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "unknown"

export interface SavedCard {
  id: string
  cardNumber: string
  lastFourDigits: string
  expiryDate: string
  cardholderName: string
  brand: CardBrand
  isDefault: boolean
}

export interface SavedAddress {
  id: string
  firstName: string
  lastName: string
  streetAddress: string
  apartment?: string
  city: string
  state: string
  zipCode: string
  country: string
  phoneNumber: string
  isDefault: boolean
}

type PaymentMethod = "card" | "paypal" | "applepay" | "googlepay" | "savedCard"

interface PaymentContextType {
  availablePaymentMethods: PaymentMethod[]
  selectedPaymentMethod: PaymentMethod
  setSelectedPaymentMethod: (method: PaymentMethod) => void
  isApplePayAvailable: boolean
  isGooglePayAvailable: boolean
  savedCards: SavedCard[]
  selectedCardId: string | null
  setSelectedCardId: (id: string | null) => void
  addSavedCard: (card: Omit<SavedCard, "id" | "isDefault">) => void
  removeSavedCard: (id: string) => void
  setDefaultCard: (id: string) => void
  savedAddresses: SavedAddress[]
  selectedAddressId: string | null
  setSelectedAddressId: (id: string | null) => void
  addSavedAddress: (address: Omit<SavedAddress, "id" | "isDefault">) => void
  removeSavedAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
  detectCardBrand: (cardNumber: string) => CardBrand
  processPayment: (amount: number) => Promise<{ success: boolean; transactionId?: string; error?: string }>
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

// Mock saved cards
const mockSavedCards: SavedCard[] = [
  {
    id: "card-1",
    cardNumber: "4111111111111111",
    lastFourDigits: "1111",
    expiryDate: "12/25",
    cardholderName: "John Doe",
    brand: "visa",
    isDefault: true,
  },
  {
    id: "card-2",
    cardNumber: "5555555555554444",
    lastFourDigits: "4444",
    expiryDate: "10/26",
    cardholderName: "John Doe",
    brand: "mastercard",
    isDefault: false,
  },
]

// Mock saved addresses
const mockSavedAddresses: SavedAddress[] = [
  {
    id: "address-1",
    firstName: "John",
    lastName: "Doe",
    streetAddress: "123 Main St",
    apartment: "Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    phoneNumber: "(123) 456-7890",
    isDefault: true,
  },
  {
    id: "address-2",
    firstName: "John",
    lastName: "Doe",
    streetAddress: "456 Park Ave",
    city: "Boston",
    state: "MA",
    zipCode: "02108",
    country: "United States",
    phoneNumber: "(123) 456-7890",
    isDefault: false,
  },
]

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<PaymentMethod[]>(["card", "paypal"])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("card")
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false)
  const [isGooglePayAvailable, setIsGooglePayAvailable] = useState(false)
  const [savedCards, setSavedCards] = useState<SavedCard[]>(mockSavedCards)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(mockSavedCards[0]?.id || null)
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(mockSavedAddresses)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(mockSavedAddresses[0]?.id || null)

  useEffect(() => {
    // Check if Apple Pay is available
    const checkApplePay = () => {
      // In a real implementation, you would use the Apple Pay JS API to check
      // if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
      const isAppleDevice = /iPhone|iPad|iPod|Mac/.test(navigator.userAgent)
      setIsApplePayAvailable(isAppleDevice)
      if (isAppleDevice) {
        setAvailablePaymentMethods((prev) => [...prev, "applepay"])
      }
    }

    // Check if Google Pay is available
    const checkGooglePay = () => {
      // In a real implementation, you would use the Google Pay API to check
      // https://developers.google.com/pay/api/web/guides/tutorial
      const isAndroidDevice = /Android/.test(navigator.userAgent)
      setIsGooglePayAvailable(isAndroidDevice)
      if (isAndroidDevice) {
        setAvailablePaymentMethods((prev) => [...prev, "googlepay"])
      }
    }

    // For demo purposes, we'll make both available in browser
    if (typeof window !== "undefined") {
      // In a real app, use the checks above
      setIsApplePayAvailable(true)
      setIsGooglePayAvailable(true)
      setAvailablePaymentMethods(["card", "paypal", "applepay", "googlepay", "savedCard"])
    }
  }, [])

  const addSavedCard = (card: Omit<SavedCard, "id" | "isDefault">) => {
    const newCard: SavedCard = {
      ...card,
      id: `card-${Date.now()}`,
      isDefault: savedCards.length === 0, // Make it default if it's the first card
    }
    setSavedCards((prev) => [...prev, newCard])
    if (newCard.isDefault) {
      setSelectedCardId(newCard.id)
    }
  }

  const removeSavedCard = (id: string) => {
    const cardToRemove = savedCards.find((card) => card.id === id)
    setSavedCards((prev) => prev.filter((card) => card.id !== id))

    // If we're removing the selected card, select another one
    if (selectedCardId === id) {
      const remainingCards = savedCards.filter((card) => card.id !== id)
      setSelectedCardId(remainingCards.length > 0 ? remainingCards[0].id : null)
    }

    // If we're removing the default card, make another one default
    if (cardToRemove?.isDefault) {
      const remainingCards = savedCards.filter((card) => card.id !== id)
      if (remainingCards.length > 0) {
        setDefaultCard(remainingCards[0].id)
      }
    }
  }

  const setDefaultCard = (id: string) => {
    setSavedCards((prev) =>
      prev.map((card) => ({
        ...card,
        isDefault: card.id === id,
      })),
    )
  }

  const addSavedAddress = (address: Omit<SavedAddress, "id" | "isDefault">) => {
    const newAddress: SavedAddress = {
      ...address,
      id: `address-${Date.now()}`,
      isDefault: savedAddresses.length === 0, // Make it default if it's the first address
    }
    setSavedAddresses((prev) => [...prev, newAddress])
    if (newAddress.isDefault) {
      setSelectedAddressId(newAddress.id)
    }
  }

  const removeSavedAddress = (id: string) => {
    const addressToRemove = savedAddresses.find((address) => address.id === id)
    setSavedAddresses((prev) => prev.filter((address) => address.id !== id))

    // If we're removing the selected address, select another one
    if (selectedAddressId === id) {
      const remainingAddresses = savedAddresses.filter((address) => address.id !== id)
      setSelectedAddressId(remainingAddresses.length > 0 ? remainingAddresses[0].id : null)
    }

    // If we're removing the default address, make another one default
    if (addressToRemove?.isDefault) {
      const remainingAddresses = savedAddresses.filter((address) => address.id !== id)
      if (remainingAddresses.length > 0) {
        setDefaultAddress(remainingAddresses[0].id)
      }
    }
  }

  const setDefaultAddress = (id: string) => {
    setSavedAddresses((prev) =>
      prev.map((address) => ({
        ...address,
        isDefault: address.id === id,
      })),
    )
  }

  const detectCardBrand = (cardNumber: string): CardBrand => {
    const cleanedNumber = cardNumber.replace(/\D/g, "")

    // Visa
    if (/^4/.test(cleanedNumber)) {
      return "visa"
    }

    // Mastercard
    if (/^5[1-5]/.test(cleanedNumber)) {
      return "mastercard"
    }

    // American Express
    if (/^3[47]/.test(cleanedNumber)) {
      return "amex"
    }

    // Discover
    if (/^(6011|65|64[4-9]|622)/.test(cleanedNumber)) {
      return "discover"
    }

    return "unknown"
  }

  const processPayment = async (amount: number) => {
    // Simulate payment processing
    return new Promise<{ success: boolean; transactionId?: string; error?: string }>((resolve) => {
      setTimeout(() => {
        // Simulate successful payment 90% of the time
        if (Math.random() < 0.9) {
          resolve({
            success: true,
            transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          })
        } else {
          resolve({
            success: false,
            error: "Payment processing failed. Please try again.",
          })
        }
      }, 1500)
    })
  }

  return (
    <PaymentContext.Provider
      value={{
        availablePaymentMethods,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        isApplePayAvailable,
        isGooglePayAvailable,
        savedCards,
        selectedCardId,
        setSelectedCardId,
        addSavedCard,
        removeSavedCard,
        setDefaultCard,
        savedAddresses,
        selectedAddressId,
        setSelectedAddressId,
        addSavedAddress,
        removeSavedAddress,
        setDefaultAddress,
        detectCardBrand,
        processPayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  )
}

export function usePayment() {
  const context = useContext(PaymentContext)
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider")
  }
  return context
}

export type { PaymentMethod }
