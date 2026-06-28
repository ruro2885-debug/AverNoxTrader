import { useState } from "react";
import { useGetGoals, useCreateGoal } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Calendar, Plus } from "lucide-react";
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
    createGoal.mutate({ data: { 
      title, 
      targetAmount: Number(target), 
      deadline, 
      actionOnCompletion: action 
    }}, {
      onSuccess: () => {
        setOpen(false);
        setTitle(""); setTarget(""); setDeadline("");
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-sans font-bold">Goal-Based Trading</h1>
          <p className="text-muted-foreground">Direct the AI to achieve specific financial targets.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> New Goal</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Define New Target</DialogTitle>
              <DialogDescription>Set a financial objective for the algorithm.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Goal Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. New Car, Vacation..." required />
              </div>
              <div className="space-y-2">
                <Label>Target Amount (USD)</Label>
                <Input type="number" value={target} onChange={e => setTarget(e.target.value)} required min="100" />
              </div>
              <div className="space-y-2">
                <Label>Target Date</Label>
                <Input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Action on Completion</Label>
                <Select value={action} onValueChange={setAction}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Continue">Continue Compounding</SelectItem>
                    <SelectItem value="Reduce">Reduce Risk Profile</SelectItem>
                    <SelectItem value="Pause">Pause Trading</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={createGoal.isPending}>Establish Goal</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64" /><Skeleton className="h-64" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals?.map(goal => {
            const percent = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
            return (
              <Card key={goal.id} className="bg-card/50 border-border">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <div className={`px-2 py-1 text-xs rounded ${goal.status === 'Active' ? 'bg-primary/20 text-primary' : 'bg-emerald-500/20 text-emerald-500'}`}>
                      {goal.status}
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" /> {new Date(goal.deadline).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Current</div>
                      <div className="text-xl font-mono">${goal.currentAmount.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground uppercase">Target</div>
                      <div className="text-xl font-mono">${goal.targetAmount.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{percent.toFixed(1)}%</span>
                    </div>
                    <Progress value={percent} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border/50 pt-4 text-xs text-muted-foreground">
                  Action on reach: <span className="font-semibold ml-1 text-foreground">{goal.actionOnCompletion || 'Continue'}</span>
                </CardFooter>
              </Card>
            );
          })}
          
          {!goals?.length && (
            <div className="col-span-full text-center p-12 border border-dashed border-border rounded-lg text-muted-foreground">
              No financial goals established. Create one to focus the AI.
            </div>
          )}
        </div>
      )}
    </div>
  );
}