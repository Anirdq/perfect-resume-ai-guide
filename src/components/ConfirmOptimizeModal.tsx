
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface ConfirmOptimizeModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmOptimizeModal = ({
  open,
  onConfirm,
  onCancel,
  loading,
}: ConfirmOptimizeModalProps) => (
  <Dialog open={open} onOpenChange={open => !open ? onCancel() : undefined}>
    <DialogContent className="max-w-sm">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Sparkles className="text-blue-600" />
          Ready to Optimize?
        </DialogTitle>
      </DialogHeader>
      <div className="text-gray-700 mt-2 text-center">
        Double-check your resume and job description. Our AI will analyze and optimize your content. Proceed now?
      </div>
      <DialogFooter className="flex flex-row gap-2 mt-4 justify-center">
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center" onClick={onConfirm} disabled={loading}>
          {loading ? (
            <span>
              <span className="inline-block animate-spin mr-2 align-middle border-2 border-white border-t-blue-600 rounded-full w-4 h-4" />
              Optimizing...
            </span>
          ) : (
            "Yes, Optimize!"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
