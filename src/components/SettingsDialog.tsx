import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getPlayerId, restoreProgressFromCloud } from '@/utils/gameLogic';
import { Copy, Download, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatsUpdated?: () => void;
}

export const SettingsDialog = ({ open, onOpenChange, onStatsUpdated }: SettingsDialogProps) => {
  const { toast } = useToast();
  const [restoreCode, setRestoreCode] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  const [copied, setCopied] = useState(false);
  const playerId = getPlayerId();

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(playerId);
    setCopied(true);
    toast({
      title: 'Code Copied!',
      description: 'Your backup code has been copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRestore = async () => {
    if (!restoreCode.trim()) {
      toast({
        title: 'Enter a Code',
        description: 'Please enter a backup code to restore',
        variant: 'destructive',
      });
      return;
    }

    setIsRestoring(true);
    const result = await restoreProgressFromCloud(restoreCode.trim());
    setIsRestoring(false);

    if (result.success) {
      toast({
        title: 'Progress Restored!',
        description: `Successfully restored ${result.stats?.totalXP} XP`,
      });
      setRestoreCode('');
      onStatsUpdated?.();
      onOpenChange(false);
    } else {
      toast({
        title: 'Restore Failed',
        description: result.error || 'Could not restore progress',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
          <DialogDescription>
            Manage your progress and backup code
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Backup Code Section */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Your Backup Code</Label>
            <p className="text-sm text-muted-foreground">
              Save this code to restore your progress on another device
            </p>
            <div className="flex gap-2">
              <Input
                value={playerId}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopyCode}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Restore Section */}
          <div className="space-y-3 pt-4 border-t">
            <Label className="text-base font-semibold">Restore Progress</Label>
            <p className="text-sm text-muted-foreground">
              Enter a backup code to restore progress from another device
            </p>
            <div className="space-y-2">
              <Input
                placeholder="space_math_xxxxxxx"
                value={restoreCode}
                onChange={(e) => setRestoreCode(e.target.value)}
                className="font-mono text-sm"
              />
              <Button
                onClick={handleRestore}
                disabled={isRestoring || !restoreCode.trim()}
                className="w-full"
              >
                {isRestoring ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Restoring...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Restore Progress
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
            <p className="font-medium mb-2">💡 How it works:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Your progress is automatically backed up to the cloud</li>
              <li>Copy your code to keep it safe</li>
              <li>Use the code on any device to restore your XP and stats</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
