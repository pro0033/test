"use client"

import { useState } from "react"
import { usePayment } from "@/components/payment-provider"

interface GooglePayButtonProps {
  amount: number
  onPaymentComplete: (result: { success: boolean; transactionId?: string; error?: string }) => void
  disabled?: boolean
}

export function GooglePayButton({ amount, onPaymentComplete, disabled = false }: GooglePayButtonProps) {
  const { processPayment } = usePayment()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleGooglePayClick = async () => {
    if (disabled || isProcessing) return

    setIsProcessing(true)
    try {
      // In a real implementation, you would use the Google Pay API
      // to create a payment request and handle the payment flow
      const result = await processPayment(amount)
      onPaymentComplete(result)
    } catch (error) {
      onPaymentComplete({
        success: false,
        error: "Google Pay payment failed. Please try another payment method.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <button
      onClick={handleGooglePayClick}
      disabled={disabled || isProcessing}
      className={`w-full h-12 rounded-md flex items-center justify-center ${
        disabled
          ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
          : "bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      }`}
      aria-label="Pay with Google Pay"
    >
      {isProcessing ? (
        <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <div className="flex items-center">
          <svg viewBox="0 0 41 17" width="41" height="17" className="mr-2">
            <path
              d="M19.526 2.635v4.083h2.518c.6 0 1.096-.202 1.488-.605.403-.402.605-.882.605-1.437 0-.544-.202-1.018-.605-1.422-.392-.413-.888-.62-1.488-.62h-2.518zm0 5.52v4.736h-1.504V1.198h3.99c1.013 0 1.873.337 2.582 1.012.72.675 1.08 1.497 1.08 2.466 0 .991-.36 1.819-1.08 2.482-.697.665-1.559.996-2.583.996h-2.485v.001zM27.194 10.442c0 .392.166.718.499.98.332.26.722.391 1.168.391.633 0 1.196-.234 1.692-.701.497-.469.744-1.019.744-1.65-.469-.37-1.123-.555-1.962-.555-.61 0-1.12.148-1.528.442-.409.294-.613.657-.613 1.093m1.946-5.815c1.112 0 1.989.297 2.633.89.642.594.964 1.408.964 2.442v4.932h-1.439v-1.11h-.065c-.622.914-1.45 1.372-2.486 1.372-.882 0-1.621-.262-2.215-.784-.594-.523-.891-1.176-.891-1.96 0-.828.313-1.486.94-1.976s1.463-.735 2.51-.735c.892 0 1.629.163 2.206.49v-.344c0-.522-.207-.966-.621-1.33a2.132 2.132 0 0 0-1.455-.547c-.84 0-1.504.353-1.995 1.062l-1.324-.828c.73-1.045 1.81-1.568 3.238-1.568M40.993 4.889l-5.02 11.53H34.42l1.864-4.034-3.302-7.496h1.635l2.387 5.749h.032l2.322-5.75z"
              fill="#4285F4"
            />
            <path
              d="M13.448 7.134c0-.473-.04-.93-.116-1.366H6.988v2.588h3.634a3.11 3.11 0 0 1-1.344 2.042v1.68h2.169c1.27-1.17 2.001-2.9 2.001-4.944"
              fill="#4285F4"
            />
            <path
              d="M6.988 13.7c1.816 0 3.344-.595 4.459-1.621l-2.169-1.681c-.603.406-1.38.643-2.29.643-1.754 0-3.244-1.182-3.776-2.774H.978v1.731A6.728 6.728 0 0 0 6.988 13.7"
              fill="#34A853"
            />
            <path
              d="M3.212 8.267a4.034 4.034 0 0 1 0-2.572V3.964H.978A6.678 6.678 0 0 0 .261 6.98c0 1.085.26 2.11.717 3.017l2.234-1.731z"
              fill="#FABB05"
            />
            <path
              d="M6.988 4.49c.992 0 1.88.34 2.58 1.008v.001l1.92-1.918C10.324 2.548 8.804 1.98 6.989 1.98A6.728 6.728 0 0 0 .261 6.98l2.951 2.287c.532-1.592 2.022-2.776 3.776-2.776"
              fill="#E94235"
            />
          </svg>
          <span className="font-medium text-gray-800 dark:text-white">Pay</span>
        </div>
      )}
    </button>
  )
}
