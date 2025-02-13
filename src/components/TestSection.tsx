
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const TestSection = () => {
  const { toast } = useToast();

  const testWorkflowKey = async () => {
    try {
      const { data: workflowKey, error: workflowKeyError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'DIFY_WORKFLOW_API_KEY')
        .single();

      if (workflowKeyError) {
        console.error('Error fetching workflow API key:', workflowKeyError);
        toast({
          title: "Error",
          description: "Failed to fetch the workflow API key",
          variant: "destructive"
        });
        return;
      }

      if (!workflowKey?.value) {
        console.error('No workflow key found');
        toast({
          title: "Error",
          description: "No workflow API key found in the database",
          variant: "destructive"
        });
        return;
      }

      console.log('Workflow Key Details:', {
        length: workflowKey.value.length,
        startsWidth: workflowKey.value.substring(0, 5),
        endsWidth: workflowKey.value.slice(-5),
        hasWhitespace: /\s/.test(workflowKey.value),
        isEmpty: workflowKey.value.trim().length === 0
      });

      toast({
        title: "Success",
        description: "Check console for API key details",
      });

    } catch (error) {
      console.error('Test error:', error);
      toast({
        title: "Error",
        description: "Failed to test the workflow API key",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">API Testing Section</h3>
      <Button 
        onClick={testWorkflowKey}
        variant="outline"
        className="w-full"
      >
        Test Workflow API Key
      </Button>
    </div>
  );
};
