import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background p-lg">
      <Text variant="h1" className="text-primary mb-xs">
        Iniciar Sesión
      </Text>
      <Text className="text-foreground opacity-70">
        Próximamente...
      </Text>
    </View>
  );
}
