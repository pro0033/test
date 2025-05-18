"use client"

import { useState } from "react"
import { usePayment, type SavedAddress } from "@/components/payment-provider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2 } from "lucide-react"

interface AddressSelectorProps {
  onAddNewAddress: () => void
  onSelectAddress: (address: SavedAddress) => void
}

export function AddressSelector({ onAddNewAddress, onSelectAddress }: AddressSelectorProps) {
  const { savedAddresses, selectedAddressId, setSelectedAddressId, removeSavedAddress, setDefaultAddress } =
    usePayment()
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null)

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId)
    const selectedAddress = savedAddresses.find((address) => address.id === addressId)
    if (selectedAddress) {
      onSelectAddress(selectedAddress)
    }
  }

  const handleDeleteAddress = (addressId: string) => {
    setShowConfirmDelete(addressId)
  }

  const confirmDeleteAddress = (addressId: string) => {
    removeSavedAddress(addressId)
    setShowConfirmDelete(null)
  }

  const cancelDeleteAddress = () => {
    setShowConfirmDelete(null)
  }

  const handleSetDefault = (addressId: string) => {
    setDefaultAddress(addressId)
  }

  if (savedAddresses.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 dark:text-gray-400 mb-4">You don't have any saved addresses yet.</p>
        <Button onClick={onAddNewAddress} className="flex items-center">
          <PlusCircle size={16} className="mr-2" />
          Add New Address
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <RadioGroup value={selectedAddressId || undefined} className="space-y-3">
        {savedAddresses.map((address) => (
          <div key={address.id} className="relative">
            <div
              className={`flex items-start justify-between border rounded-md p-3 ${
                showConfirmDelete === address.id ? "border-red-500 dark:border-red-400" : "dark:border-gray-700"
              }`}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem
                  value={address.id}
                  id={address.id}
                  onClick={() => handleAddressSelect(address.id)}
                  disabled={showConfirmDelete !== null}
                  className="mt-1"
                />
                <div>
                  <Label htmlFor={address.id} className="font-medium dark:text-white">
                    {address.firstName} {address.lastName}
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {address.streetAddress}
                    {address.apartment && `, ${address.apartment}`}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{address.country}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{address.phoneNumber}</p>
                  {address.isDefault && (
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Default</span>
                  )}
                </div>
              </div>
              {showConfirmDelete === address.id ? (
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => confirmDeleteAddress(address.id)}
                    className="h-8 text-xs"
                  >
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={cancelDeleteAddress}
                    className="h-8 text-xs dark:border-gray-600 dark:text-gray-200"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {!address.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetDefault(address.id)}
                      className="h-8 text-xs dark:border-gray-600 dark:text-gray-200"
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteAddress(address.id)}
                    className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>

      <Button
        variant="outline"
        onClick={onAddNewAddress}
        className="w-full flex items-center justify-center dark:border-gray-700 dark:text-white"
      >
        <PlusCircle size={16} className="mr-2" />
        Add New Address
      </Button>
    </div>
  )
}
