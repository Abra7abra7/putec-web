import { getCheckoutSettings } from "../../utils/getCheckout";
import CheckoutClient from "../../components/checkout/CheckoutClient";

export default async function CheckoutPage() {
  const checkoutData = await getCheckoutSettings();

  return (
    <CheckoutClient initialCheckoutData={checkoutData} />
  );
}
