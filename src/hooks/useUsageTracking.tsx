
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UsageData {
  free_optimizations_used: number;
  canOptimize: boolean;
  isLoading: boolean;
}

export const useUsageTracking = () => {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UsageData>({
    free_optimizations_used: 0,
    canOptimize: true,
    isLoading: true
  });

  useEffect(() => {
    if (user) {
      fetchUsage();
    }
  }, [user]);

  const fetchUsage = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('usage_tracking')
        .select('free_optimizations_used')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching usage:', error);
        return;
      }

      const optimizationsUsed = data?.free_optimizations_used || 0;
      const canOptimize = optimizationsUsed < 1; // Free users get 1 optimization

      setUsage({
        free_optimizations_used: optimizationsUsed,
        canOptimize,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching usage:', error);
      setUsage(prev => ({ ...prev, isLoading: false }));
    }
  };

  const incrementUsage = async () => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('usage_tracking')
        .update({
          free_optimizations_used: usage.free_optimizations_used + 1,
          last_optimization_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating usage:', error);
        toast.error('Failed to track usage');
        return false;
      }

      // Update local state
      setUsage(prev => ({
        ...prev,
        free_optimizations_used: prev.free_optimizations_used + 1,
        canOptimize: prev.free_optimizations_used + 1 < 1
      }));

      return true;
    } catch (error) {
      console.error('Error incrementing usage:', error);
      return false;
    }
  };

  return {
    ...usage,
    incrementUsage,
    refreshUsage: fetchUsage
  };
};
