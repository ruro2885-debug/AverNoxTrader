import { useState } from "react";
import { useGetSupportIssues, useSubmitSupportRequest } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, MessageCircle, ExternalLink } from "lucide-react";

export default function Support() {
  const { data: issues, isLoading } = useGetSupportIssues();
  const submitRequest = useSubmitSupportRequest();
  const { toast } = useToast();
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  const handleSubmit = (id: number) => {
    setSubmittingId(id);
    submitRequest.mutate({ data: { issueId: id } }, {
      onSuccess: () => {
        toast({ title: "Request Submitted", description: "Your request has been submitted, our team will resolve this shortly." });
        setSubmittingId(null);
      },
      onError: () => setSubmittingId(null)
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-sans font-bold">Client Support</h1>
        <p className="text-muted-foreground">Priority assistance for AverNox platform users.</p>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Direct Agent Access</h3>
              <p className="text-sm text-muted-foreground">If you still face the same issue contact our dedicated support bot.</p>
            </div>
          </div>
          <Button asChild className="shrink-0">
            <a href="https://t.me/AverNoxTraderbot" target="_blank" rel="noreferrer">
              Contact @AverAssistancebot <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold flex items-center gap-2 mt-8">
        <HelpCircle className="h-5 w-5" /> Common Inquiries
      </h2>
      
      {isLoading ? (
        <div className="space-y-4"><Skeleton className="h-16" /><Skeleton className="h-16" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {issues?.map(issue => (
            <Card key={issue.id} className="bg-card/50 border-border hover:bg-card/80 transition-colors">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium">{issue.title}</div>
                  <div className="text-xs text-muted-foreground">{issue.category}</div>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  disabled={submittingId === issue.id}
                  onClick={() => handleSubmit(issue.id)}
                >
                  {submittingId === issue.id ? "Submitting..." : "Report this"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}