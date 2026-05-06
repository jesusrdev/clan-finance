import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import { PROFILE_AVATAR_EMOJIS } from "@/features/profile/constants/avatarEmojis";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Pressable, ScrollView, View } from "react-native";

interface EmojiPickerProps {
  currentEmoji?: string | null;
  onSelect: (emoji: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmojiPicker({
  currentEmoji,
  onSelect,
  open,
  onOpenChange,
}: EmojiPickerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle>Elige tu Avatar</DialogTitle>
        </DialogHeader>
        <ScrollView className="max-h-72" showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap justify-center gap-3 py-4">
            {PROFILE_AVATAR_EMOJIS.map((emoji) => (
              <Pressable
                key={emoji}
                onPress={() => {
                  onSelect(emoji);
                  onOpenChange(false);
                }}
                className={cn(
                  "size-16 items-center justify-center rounded-2xl border-2 transition-all",
                  currentEmoji === emoji
                    ? "border-primary bg-primary/10"
                    : "border-border/50 bg-card/50",
                )}
              >
                <Text className="text-3xl">{emoji}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </DialogContent>
    </Dialog>
  );
}
