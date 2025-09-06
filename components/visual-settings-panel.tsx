import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface VisualSettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function VisualSettingsPanel({ open, onOpenChange, children }: VisualSettingsPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>✨ Visual Effects</SheetTitle>
          <SheetDescription>
            Customize the Matrix background animations and particle effects.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 py-4 space-y-4 overflow-y-auto max-h-[calc(100vh-120px)]">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}