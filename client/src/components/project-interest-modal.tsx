import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { HeartIcon, UsersIcon } from "lucide-react";

interface ProjectInterestModalProps {
  projectId: string;
  projectTitle: string;
  children: React.ReactNode;
}

interface Group {
  id: string;
  name: string;
  projectId: string;
  status: "pending" | "approved" | "rejected";
}

export default function ProjectInterestModal({ projectId, projectTitle, children }: ProjectInterestModalProps) {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [interestMessage, setInterestMessage] = useState("");
  const { toast } = useToast();
  const auth = useAuth();
  const queryClient = useQueryClient();

  // Query to get existing groups for this project
  const { data: projectGroups = [] } = useQuery<Group[]>({
    queryKey: ["/api/projects", projectId, "groups"],
    enabled: open, // Only fetch when modal is open
  });

  const createInterestMutation = useMutation({
    mutationFn: async (data: { userId: string; projectId: string; message: string }) => {
      const response = await fetch("/api/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Falha ao demonstrar interesse");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Interesse demonstrado!",
        description: `Seu interesse pelo projeto "${projectTitle}" foi registrado.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setOpen(false);
      setInterestMessage("");
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao demonstrar interesse. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const createGroupMutation = useMutation({
    mutationFn: async (data: { name: string; projectId: string; leaderId: string }) => {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Falha ao criar grupo");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Grupo criado!",
        description: `Grupo "${groupName}" foi criado e está aguardando aprovação do professor.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "groups"] });
      setOpen(false);
      setGroupName("");
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao criar grupo. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const handleInterestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.user) return;

    createInterestMutation.mutate({
      userId: auth.user.id,
      projectId,
      message: interestMessage,
    });
  };

  const handleGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.user || !groupName.trim()) return;

    // Check for existing groups for this project
    const approvedGroup = projectGroups.find(group => group.status === "approved");
    const pendingGroups = projectGroups.filter(group => group.status === "pending");

    // If there's already an approved group, don't allow new groups
    if (approvedGroup) {
      toast({
        title: "Tema não disponível",
        description: "Este tema já foi confirmado pelo professor e não está mais disponível para seleção.",
        variant: "destructive",
      });
      return;
    }

    // If there are pending groups, show conflict message but allow submission
    if (pendingGroups.length > 0) {
      toast({
        title: "Conflito de tema",
        description: "Alguém já solicitou esse tema. Seu professor vai decidir quem vai ficar com qual.",
        variant: "default",
      });
    }

    createGroupMutation.mutate({
      name: groupName.trim(),
      projectId,
      leaderId: auth.user.id,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild data-testid="button-open-interest-modal">
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" data-testid="interest-modal">
        <DialogHeader>
          <DialogTitle>Interesse no Projeto</DialogTitle>
          <DialogDescription>
            Demonstre seu interesse e/ou crie um grupo para "{projectTitle}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Demonstrar Interesse */}
          <form onSubmit={handleInterestSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <HeartIcon className="w-4 h-4" />
              Demonstrar Interesse
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest-message">Mensagem (opcional)</Label>
              <Textarea
                id="interest-message"
                data-testid="input-interest-message"
                placeholder="Por que você tem interesse neste projeto?"
                value={interestMessage}
                onChange={(e) => setInterestMessage(e.target.value)}
                rows={3}
              />
            </div>
            <Button 
              type="submit" 
              variant="outline" 
              className="w-full"
              data-testid="button-submit-interest"
              disabled={createInterestMutation.isPending}
            >
              {createInterestMutation.isPending ? "Enviando..." : "Demonstrar Interesse"}
            </Button>
          </form>

          <div className="border-t pt-4">
            {/* Criar Grupo */}
            <form onSubmit={handleGroupSubmit} className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <UsersIcon className="w-4 h-4" />
                Criar Grupo
              </div>
              <div className="space-y-2">
                <Label htmlFor="group-name">Nome do Grupo</Label>
                <Input
                  id="group-name"
                  data-testid="input-group-name"
                  placeholder="Ex: Equipe DevMasters"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                data-testid="button-create-group"
                disabled={createGroupMutation.isPending || !groupName.trim()}
              >
                {createGroupMutation.isPending ? "Criando..." : "Criar Grupo"}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}