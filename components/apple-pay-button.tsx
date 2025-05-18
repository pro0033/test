"use client"

import { useState } from "react"
import { usePayment } from "@/components/payment-provider"

interface ApplePayButtonProps {
  amount: number
  onPaymentComplete: (result: { success: boolean; transactionId?: string; error?: string }) => void
  disabled?: boolean
}

export function ApplePayButton({ amount, onPaymentComplete, disabled = false }: ApplePayButtonProps) {
  const { processPayment } = usePayment()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApplePayClick = async () => {
    if (disabled || isProcessing) return

    setIsProcessing(true)
    try {
      // In a real implementation, you would use the Apple Pay JS API
      // to create a payment request and handle the payment flow
      const result = await processPayment(amount)
      onPaymentComplete(result)
    } catch (error) {
      onPaymentComplete({
        success: false,
        error: "Apple Pay payment failed. Please try another payment method.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <button
      onClick={handleApplePayClick}
      disabled={disabled || isProcessing}
      className={`w-full h-12 rounded-md flex items-center justify-center ${
        disabled
          ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
          : "bg-black text-white hover:bg-gray-800 active:bg-gray-900"
      }`}
      aria-label="Pay with Apple Pay"
    >
      {isProcessing ? (
        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <div className="flex items-center">
          <svg viewBox="0 0 24 24" width="24" height="24" className="fill-current">
            <path d="M17.0425 10.1843C17.0142 8.48448 18.4123 7.54576 18.4823 7.50221C17.5761 6.17188 16.1654 5.98905 15.6686 5.97352C14.4211 5.84576 13.2161 6.69576 12.5823 6.69576C11.9361 6.69576 10.9455 5.98905 9.89548 6.00905C8.53173 6.02905 7.26923 6.78352 6.58048 7.97352C5.15923 10.3922 6.21423 13.9547 7.58048 15.9235C8.26173 16.8922 9.06798 17.9735 10.1255 17.9347C11.1567 17.8922 11.5636 17.2547 12.8073 17.2547C14.0386 17.2547 14.4211 17.9347 15.5011 17.9122C16.6161 17.8922 17.3161 16.9297 17.9711 15.9497C18.7455 14.8297 19.0567 13.7297 19.0717 13.6797C19.0417 13.6685 17.0755 12.9047 17.0425 10.1843Z" />
            <path d="M15.2386 4.58352C15.7917 3.90227 16.1655 2.97227 16.0592 2.02905C15.2767 2.06477 14.2917 2.57852 13.7155 3.24352C13.2036 3.83602 12.7505 4.80227 12.8717 5.71102C13.7461 5.77852 14.6636 5.25227 15.2386 4.58352Z" />
          </svg>
          <span className="ml-2 font-medium">Pay</span>
        </div>
      )}
    </button>
  )
}
