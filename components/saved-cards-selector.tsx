"use client"

import { useState } from "react"
import { usePayment } from "@/components/payment-provider"
import { CardBrandIcon } from "@/components/card-brand-icon"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2 } from "lucide-react"

interface SavedCardsSelectorProps {
  onAddNewCard: () => void
}

export function SavedCardsSelector({ onAddNewCard }: SavedCardsSelectorProps) {
  const { savedCards, selectedCardId, setSelectedCardId, removeSavedCard, setDefaultCard } = usePayment()
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null)

  const handleCardSelect = (cardId: string) => {
    setSelectedCardId(cardId)
  }

  const handleDeleteCard = (cardId: string) => {
    setShowConfirmDelete(cardId)
  }

  const confirmDeleteCard = (cardId: string) => {
    removeSavedCard(cardId)
    setShowConfirmDelete(null)
  }

  const cancelDeleteCard = () => {
    setShowConfirmDelete(null)
  }

  const handleSetDefault = (cardId: string) => {
    setDefaultCard(cardId)
  }

  if (savedCards.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 dark:text-gray-400 mb-4">You don't have any saved cards yet.</p>
        <Button onClick={onAddNewCard} className="flex items-center">
          <PlusCircle size={16} className="mr-2" />
          Add New Card
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <RadioGroup value={selectedCardId || undefined} className="space-y-3">
        {savedCards.map((card) => (
          <div key={card.id} className="relative">
            <div
              className={`flex items-center justify-between border rounded-md p-3 ${
                showConfirmDelete === card.id ? "border-red-500 dark:border-red-400" : "dark:border-gray-700"
              }`}
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value={card.id}
                  id={card.id}
                  onClick={() => handleCardSelect(card.id)}
                  disabled={showConfirmDelete !== null}
                />
                <div className="flex items-center">
                  <CardBrandIcon brand={card.brand} className="mr-2" size={24} />
                  <div>
                    <Label htmlFor={card.id} className="font-medium dark:text-white">
                      •••• {card.lastFourDigits}
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Expires {card.expiryDate}
                      {card.isDefault && (
                        <span className="ml-2 text-green-600 dark:text-green-400 font-medium">Default</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              {showConfirmDelete === card.id ? (
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => confirmDeleteCard(card.id)}
                    className="h-8 text-xs"
                  >
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={cancelDeleteCard}
                    className="h-8 text-xs dark:border-gray-600 dark:text-gray-200"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {!card.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetDefault(card.id)}
                      className="h-8 text-xs dark:border-gray-600 dark:text-gray-200"
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteCard(card.id)}
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
        onClick={onAddNewCard}
        className="w-full flex items-center justify-center dark:border-gray-700 dark:text-white"
      >
        <PlusCircle size={16} className="mr-2" />
        Add New Card
      </Button>
    </div>
  )
}
