"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardBrandIcon } from "@/components/card-brand-icon"
import { usePayment } from "@/components/payment-provider"

interface CreditCardInputProps {
  onCardDetailsChange?: (
    isValid: boolean,
    cardDetails: {
      cardNumber: string
      expiryDate: string
      cvv: string
      cardholderName: string
      brand: ReturnType<typeof usePayment>["detectCardBrand"]
    },
  ) => void
}

export function CreditCardInput({ onCardDetailsChange }: CreditCardInputProps) {
  const { detectCardBrand } = usePayment()
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [cardBrand, setCardBrand] = useState(detectCardBrand(""))
  const [isValid, setIsValid] = useState(false)

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    let formatted = ""

    // Format based on card type
    if (cardBrand === "amex") {
      // AMEX: XXXX XXXXXX XXXXX
      for (let i = 0; i < cleaned.length; i++) {
        if (i === 4 || i === 10) formatted += " "
        formatted += cleaned[i]
      }
    } else {
      // Others: XXXX XXXX XXXX XXXX
      for (let i = 0; i < cleaned.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += " "
        formatted += cleaned[i]
      }
    }

    return formatted.trim()
  }

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    let formatted = ""

    if (cleaned.length > 0) {
      // First part (month)
      const month = cleaned.substring(0, 2)
      formatted = month

      // Add slash and year if we have more than 2 digits
      if (cleaned.length > 2) {
        formatted += "/" + cleaned.substring(2, 4)
      }
    }

    return formatted
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const cleaned = value.replace(/\D/g, "")

    // Limit length based on card type
    const maxLength = cardBrand === "amex" ? 15 : 16
    if (cleaned.length <= maxLength) {
      const formatted = formatCardNumber(value)
      setCardNumber(formatted)

      // Detect card brand
      const newBrand = detectCardBrand(cleaned)
      setCardBrand(newBrand)
    }
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const formatted = formatExpiryDate(value)
    setExpiryDate(formatted)
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    // Limit CVV length (3 for most cards, 4 for AMEX)
    const maxLength = cardBrand === "amex" ? 4 : 3
    if (value.length <= maxLength) {
      setCvv(value)
    }
  }

  // Validate all fields and notify parent component
  useEffect(() => {
    const cardNumberValid = cardNumber.replace(/\D/g, "").length >= (cardBrand === "amex" ? 15 : 16)
    const expiryValid = /^\d{2}\/\d{2}$/.test(expiryDate)
    const cvvValid = cvv.length === (cardBrand === "amex" ? 4 : 3)
    const nameValid = cardholderName.trim().length > 0

    const allValid = cardNumberValid && expiryValid && cvvValid && nameValid
    setIsValid(allValid)

    if (onCardDetailsChange) {
      onCardDetailsChange(allValid, {
        cardNumber: cardNumber.replace(/\D/g, ""),
        expiryDate,
        cvv,
        cardholderName,
        brand: cardBrand,
      })
    }
  }, [cardNumber, expiryDate, cvv, cardholderName, cardBrand, onCardDetailsChange])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardholderName" className="dark:text-white">
          Name on Card
        </Label>
        <Input
          id="cardholderName"
          placeholder="John Doe"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardNumber" className="dark:text-white">
          Card Number
        </Label>
        <div className="relative">
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={handleCardNumberChange}
            className="pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <div className="absolute left-3 top-2.5">
            <CardBrandIcon brand={cardBrand} size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate" className="dark:text-white">
            Expiry Date
          </Label>
          <Input
            id="expiryDate"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={handleExpiryDateChange}
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvv" className="dark:text-white">
            CVV
          </Label>
          <Input
            id="cvv"
            placeholder={cardBrand === "amex" ? "4 digits" : "3 digits"}
            value={cvv}
            onChange={handleCvvChange}
            type="password"
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
      </div>
    </div>
  )
}
