
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
        <Alert className="border-blue-200 bg-blue-50">
          <Zap className="h-4 w-4 text-blue-600" />
          <AlertDescription className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-blue-800">
                Free Plan: You have <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {1 - free_optimizations_used} optimization{1 - free_optimizations_used !== 1 ? 's' : ''} remaining
                </Badge>
              </span>
            </div>
            <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-100">
              <Crown className="h-4 w-4 mr-1" />
              Upgrade for Unlimited
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-orange-800">
              You've used your free optimization. Upgrade to continue optimizing resumes.
            </span>
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
              <Crown className="h-4 w-4 mr-1" />
              Upgrade Now
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
