import { CreditCard } from "lucide-react"
import type { CardBrand } from "@/components/payment-provider"

interface CardBrandIconProps {
  brand: CardBrand
  className?: string
  size?: number
}

export function CardBrandIcon({ brand, className = "", size = 24 }: CardBrandIconProps) {
  switch (brand) {
    case "visa":
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.2818 8H17.9274L15.5003 15.7219L14.5974 10.3281C14.4597 9.5875 13.8161 8 12.5 8H7.5L7.5 8.46094C8.57895 8.68156 9.55263 9.01875 10.4211 9.46875L13.5 16H16.5L20.5 8H22.2818Z"
            fill="#1434CB"
          />
          <path d="M8.5 8H4.5L2 16H6L6.5 14.5H9.5L10 16H14L11.5 8H8.5ZM7 12.5L8 10L8.5 12.5H7Z" fill="#1434CB" />
        </svg>
      )
    case "mastercard":
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M15 4H9V16H15V4Z" fill="#FF5F00" />
          <path
            d="M9.5 10C9.5 7.5 10.5 5.3 12 4C10.8049 3.0151 9.3143 2.5 7.8 2.5C4.2 2.5 1.3 5.9 1.3 10C1.3 14.1 4.2 17.5 7.8 17.5C9.3143 17.5 10.8049 16.9849 12 16C10.5 14.7 9.5 12.5 9.5 10Z"
            fill="#EB001B"
          />
          <path
            d="M22.7 10C22.7 14.1 19.8 17.5 16.2 17.5C14.6857 17.5 13.1951 16.9849 12 16C13.5 14.7 14.5 12.5 14.5 10C14.5 7.5 13.5 5.3 12 4C13.1951 3.0151 14.6857 2.5 16.2 2.5C19.8 2.5 22.7 5.9 22.7 10Z"
            fill="#F79E1B"
          />
        </svg>
      )
    case "amex":
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="2" y="5" width="20" height="14" fill="#1F72CD" />
          <path
            d="M7 14L8 12L9 14H7ZM15 10L16 8L17 10H15ZM13 14H17V13H14V12H17V11H14V10H17V9H13V14ZM7 9H9.5L10.5 11L11.5 9H14V14H12V10.5L10.5 13H9.5L8 10.5V14H7V9Z"
            fill="white"
          />
        </svg>
      )
    case "discover":
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="2" y="5" width="20" height="14" rx="2" fill="#FFFFFF" />
          <path
            d="M22 12C22 13.3 21.5 14.6 20.5 15.4C19.6 16.2 18.3 16.5 17 16.5H7C5.7 16.5 4.4 16.2 3.5 15.4C2.5 14.6 2 13.3 2 12C2 10.7 2.5 9.4 3.5 8.6C4.4 7.8 5.7 7.5 7 7.5H17C18.3 7.5 19.6 7.8 20.5 8.6C21.5 9.4 22 10.7 22 12Z"
            fill="#F27712"
          />
          <path
            d="M12 14.5C13.6569 14.5 15 13.1569 15 11.5C15 9.84315 13.6569 8.5 12 8.5C10.3431 8.5 9 9.84315 9 11.5C9 13.1569 10.3431 14.5 12 14.5Z"
            fill="#F27712"
          />
        </svg>
      )
    default:
      return <CreditCard size={size} className={className} />
  }
}
