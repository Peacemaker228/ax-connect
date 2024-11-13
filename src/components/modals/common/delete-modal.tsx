import { FC } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface IDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  isLoading: boolean
  onSubmit: () => Promise<void>
  name: string | undefined
  type: 'channel' | 'server'
}

export const DeleteModal: FC<IDeleteModalProps> = ({ isOpen, onClose, isLoading, onSubmit, name, type }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center">Delete {type === 'channel' ? 'Channel' : 'Server'}</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
            <span className="font-semibold text-indigo-500">{type === 'channel' ? `#${name}` : name}</span> will be
            permanently deleted
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant="primary"
              onClick={() => {
                return onSubmit()
              }}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
