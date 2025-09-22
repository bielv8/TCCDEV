import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { CheckCircleIcon } from "lucide-react";

interface DeliveryCompletionModalProps {
  scheduleId: string;
  groupId: string;
  deliveryTitle: string;
  children: React.ReactNode;
}

export default function DeliveryCompletionModal({ 
  scheduleId, 
  groupId, 
  deliveryTitle, 
  children 
}: DeliveryCompletionModalProps) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const auth = useAuth();
  const queryClient = useQueryClient();

  const createCompletionMutation = useMutation({
    mutationFn: async (data: { scheduleId: string; groupId: string; notes: string }) => {
      const response = await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Falha ao marcar entrega como concluída");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Entrega marcada como concluída!",
        description: `A entrega "${deliveryTitle}" foi marcada como concluída.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      setOpen(false);
      setNotes("");
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao marcar entrega como concluída. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createCompletionMutation.mutate({
      scheduleId,
      groupId,
      notes: notes.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild data-testid="button-open-delivery-modal">
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" data-testid="delivery-completion-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
            Marcar Entrega como Concluída
          </DialogTitle>
          <DialogDescription>
            Marque "{deliveryTitle}" como concluída para o seu grupo.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="completion-notes">Observações (opcional)</Label>
            <Textarea
              id="completion-notes"
              data-testid="input-completion-notes"
              placeholder="Adicione observações sobre a entrega, links para o trabalho, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              data-testid="button-cancel-completion"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              data-testid="button-confirm-completion"
              disabled={createCompletionMutation.isPending}
            >
              {createCompletionMutation.isPending ? "Marcando..." : "Marcar como Concluída"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}