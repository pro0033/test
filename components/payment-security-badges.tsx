import { Shield, Lock, CheckCircle } from "lucide-react"

export function PaymentSecurityBadges() {
  return (
    <div className="mt-6 border-t pt-4 dark:border-gray-700">
      <h3 className="text-sm font-medium mb-3 dark:text-white">Secure Checkout</h3>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-md">
          <Lock size={16} className="text-green-600 dark:text-green-400 mr-2" />
          <span className="text-xs text-gray-700 dark:text-gray-300">SSL Encrypted</span>
        </div>
        <div className="flex items-center bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-md">
          <Shield size={16} className="text-green-600 dark:text-green-400 mr-2" />
          <span className="text-xs text-gray-700 dark:text-gray-300">PCI Compliant</span>
        </div>
        <div className="flex items-center bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-md">
          <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2" />
          <span className="text-xs text-gray-700 dark:text-gray-300">Secure Payments</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
        Your payment information is securely processed and never stored on our servers. We use industry-standard
        encryption to protect your personal data.
      </p>
    </div>
  )
}
