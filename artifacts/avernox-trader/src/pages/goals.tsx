import { useState } from "react";
import { useGetGoals, useCreateGoal } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Calendar, Plus, X, Trophy } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Goals() {
  const { data: goals, isLoading } = useGetGoals();
  const createGoal = useCreateGoal();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [action, setAction] = useState("Continue");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createGoal.mutate({ data: { title, targetAmount: Number(target), deadline, actionOnCompletion: action } }, {
      onSuccess: () => {
        setOpen(false);
        setTitle(""); setTarget(""); setDeadline("");
      }
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Goals</h1>
          <p className="text-sm text-muted-foreground">Set financial targets for the AI</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-bold px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" /> New Goal
            </button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border rounded-2xl max-w-sm">
            <DialogHeader>
              <DialogTitle>New Financial Goal</DialogTitle>
              <DialogDescription>Set a target for the AI to optimize towards.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Goal Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. New Car, Holiday..." required className="h-11 bg-muted/30 border-border rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Target Amount (USD)</Label>
                <Input type="number" value={target} onChange={e => setTarget(e.target.value)} required min="100" placeholder="$5,000" className="h-11 bg-muted/30 border-border rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Target Date</Label>
                <Input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required className="h-11 bg-muted/30 border-border rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>On Completion</Label>
                <Select value={action} onValueChange={setAction}>
                  <SelectTrigger className="h-11 bg-muted/30 border-border rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Continue">Continue Compounding</SelectItem>
                    <SelectItem value="Reduce">Reduce Risk Profile</SelectItem>
                    <SelectItem value="Pause">Pause Trading</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full h-11 rounded-xl font-bold" disabled={createGoal.isPending}>
                {createGoal.isPending ? "Creating..." : "Create Goal"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3">{[1,2].map(i => <Skeleton key={i} className="h-44 rounded-2xl" />)}</div>
      ) : !goals?.length ? (
        <div className="bg-card border border-dashed border-border rounded-2xl py-14 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Target className="h-7 w-7 text-primary" />
          </div>
          <h3 className="text-base font-bold">No Goals Yet</h3>
          <p className="text-sm text-muted-foreground">Create a goal to direct the AI toward a financial target.</p>
          <button onClick={() => setOpen(true)} className="text-sm text-primary font-semibold hover:underline">
            + Create your first goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {goals.map(goal => {
            const percent = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
            const isComplete = goal.status !== "Active";
            return (
              <div key={goal.id} className={`bg-card border rounded-2xl p-4 space-y-4 ${isComplete ? "border-[#0ECB81]/30" : "border-border"}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isComplete ? "bg-[#0ECB81]/15" : "bg-primary/10"}`}>
                      {isComplete ? <Trophy className="h-5 w-5 text-[#0ECB81]" /> : <Target className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{goal.title}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Calendar className="h-3 w-3" />
                        {new Date(goal.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isComplete ? "bg-[#0ECB81]/15 text-[#0ECB81]" : "bg-primary/10 text-primary"}`}>
                    {goal.status}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-bold">{percent.toFixed(1)}%</span>
                  </div>
                  <Progress value={percent} className="h-2.5 rounded-full" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/20 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">Current</p>
                    <p className="text-base font-bold text-[#0ECB81]">${goal.currentAmount.toFixed(2)}</p>
                  </div>
                  <div className="bg-muted/20 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">Target</p>
                    <p className="text-base font-bold">${goal.targetAmount.toFixed(2)}</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  On completion: <span className="text-foreground font-semibold">{goal.actionOnCompletion || "Continue"}</span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
