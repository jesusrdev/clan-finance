import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesión desde Home:', error);
    } finally {
      router.replace('/login');
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-background p-md">
      <Text variant="h2" className="text-primary">
        🏠 Inicio
      </Text>
      <Text className="text-foreground mt-sm opacity-70 mb-lg">
        Bienvenido a tu Clan
      </Text>
      <Button variant="outline" onPress={handleLogout}>
        <Text>Cerrar Sesión</Text>
      </Button>
    </View>
  );
}
