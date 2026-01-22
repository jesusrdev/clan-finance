import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Text variant="h2" className="text-primary">
        🏠 Inicio
      </Text>
      <Text className="text-foreground mt-sm opacity-70">
        Bienvenido a tu Clan
      </Text>
    </View>
  );
}
