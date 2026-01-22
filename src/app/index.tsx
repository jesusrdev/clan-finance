import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export default function IndexScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-background p-lg">
      <Text variant="h1" className="text-primary mb-sm">
        🎮 Clan Finance
      </Text>
      <Text variant="h2" className="text-foreground mb-md">
        Quest & Savings
      </Text>
      <Text className="text-foreground text-center opacity-70">
        Aplicación de finanzas familiares gamificada
      </Text>
    </View>
  );
}
