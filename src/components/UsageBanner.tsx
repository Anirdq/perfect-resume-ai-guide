
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Zap, Crown } from 'lucide-react';
import { useUsageTracking } from '@/hooks/useUsageTracking';

export const UsageBanner = () => {
  const { free_optimizations_used, canOptimize, isLoading } = useUsageTracking();

  if (isLoading) return null;

  return (
    <div className="mb-6">
      {canOptimize ? (
        <Alert className="border-slate-200 bg-slate-50">
          <Zap className="h-4 w-4 text-slate-700" />
          <AlertDescription className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-slate-800">
                Free Plan: You have <Badge variant="secondary" className="bg-slate-100 text-slate-800 font-medium">
                  {1 - free_optimizations_used} optimization{1 - free_optimizations_used !== 1 ? 's' : ''} remaining
                </Badge>
              </span>
            </div>
            <Button variant="outline" size="sm" className="border-slate-200 text-slate-700 hover:bg-slate-100 font-medium">
              <Crown className="h-4 w-4 mr-1" />
              Upgrade Plan
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-amber-800">
              You've used your free optimization. Upgrade to continue optimizing resumes.
            </span>
            <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white font-medium">
              <Crown className="h-4 w-4 mr-1" />
              Upgrade Now
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
