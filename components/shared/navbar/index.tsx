import { useCurrentUser } from "@/lib/hooks/use-current-user";
import Link from "next/link";
import AddPaymentMethod from "../dialogs/payment-method/add-payment-method";
import AddTransaction from "../dialogs/transactions/add-transaction";
import ProfileMenu from "./profile-menu";

export default function Navbar() {
    const user = useCurrentUser();
    return (
        <div className="mb-8 flex  flex-1 items-center justify-between gap-4 border-b p-4">
            <div>
                <Link href="/" className="text-xl font-medium hover:underline">
                    Savimo.app
                </Link>
            </div>
            <div className="flex-1" />
            <div className="flex gap-4">
                <AddPaymentMethod />
                <AddTransaction />
            </div>
            <div>
                <ProfileMenu />
            </div>
        </div>
    );
}
