import { useForm } from "react-hook-form";
import api from "../api/axios";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

type PaymentFormData = { paid_value: number; payment_date: string };
interface RegisterPaymentFormProps {
  installmentId: number;
  baseValue: number;
  onPaymentRegistered: () => void;
  closeDialog: () => void;
}

export function RegisterPaymentForm({
  installmentId,
  baseValue,
  onPaymentRegistered,
  closeDialog,
}: RegisterPaymentFormProps) {
  const form = useForm<PaymentFormData>({
    defaultValues: {
      paid_value: baseValue,
      payment_date: new Date().toISOString().split("T")[0],
    },
  });

  async function onSubmit(data: PaymentFormData) {
    try {
      const payload = {
        paid_value: Number(data.paid_value),
        payment_date: data.payment_date,
      };
      await api.patch(`/contracts/installments/${installmentId}/pay`, payload);
      onPaymentRegistered();
      closeDialog();
    } catch (error) {
      console.error("Falha ao registrar pagamento:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="paid_value"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Pago (R$)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="payment_date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data do Pagamento</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit">Confirmar Pagamento</Button>
        </div>
      </form>
    </Form>
  );
}
