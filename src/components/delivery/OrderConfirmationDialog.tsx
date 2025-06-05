import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Truck } from "lucide-react";
import { BilingualText } from "../shared/BilingualText";

interface OrderConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

export function OrderConfirmationDialog({ isOpen, onClose, orderId }: OrderConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader className="items-center text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
          <AlertDialogTitle className="text-2xl font-headline">
            <BilingualText en="Order Confirmed!" hi="ऑर्डर की पुष्टि हो गई!" />
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            <BilingualText en={`Your order #${orderId} has been placed successfully.`} hi={`आपका ऑर्डर #${orderId} सफलतापूर्वक कर दिया गया है।`} />
            <br />
            <BilingualText en="It will be delivered within 45 minutes." hi="यह 45 मिनट के भीतर डिलीवर हो जाएगा।" />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col space-y-2 sm:flex-col sm:space-y-2 sm:space-x-0">
          <AlertDialogAction asChild>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Truck className="mr-2 h-5 w-5" />
              <BilingualText en="Track Order" hi="ऑर्डर ट्रैक करें" />
            </Button>
          </AlertDialogAction>
          <AlertDialogCancel asChild>
            <Button variant="outline" className="w-full" onClick={onClose}>
              <BilingualText en="Continue Shopping" hi="खरीदारी जारी रखें" />
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
