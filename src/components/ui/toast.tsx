import * as React from "react";
import { View, Pressable, Platform, useWindowDimensions } from "react-native";
import { Text } from "@/components/ui/text";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { useUniwind } from "uniwind";
import { THEME } from "@/lib/theme";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  show: (title: string, message: string, type?: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);
  const { theme } = useUniwind();
  const { width } = useWindowDimensions();
  const horizontalInset = width < 390 ? 14 : 18;

  const show = React.useCallback(
    (title: string, message: string, type: ToastType = "info") => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, title, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <View
        style={{
          position: "absolute",
          top: Platform.OS === "web" ? 20 : 60,
          left: horizontalInset,
          right: horizontalInset,
          alignItems: "center",
          zIndex: 9999,
          pointerEvents: "box-none",
        }}
      >
        {toasts.map((toast, index) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            index={index}
            theme={theme as keyof typeof THEME}
            width={width}
            onDismiss={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  index,
  theme,
  width,
  onDismiss,
}: {
  toast: ToastMessage;
  index: number;
  theme: keyof typeof THEME;
  width: number;
  onDismiss: () => void;
}) {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withSpring(0, {
      damping: 12,
      stiffness: 500,
      mass: 0.5,
    });
    opacity.value = withTiming(1, { duration: 80 });

    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 180 });
      translateY.value = withTiming(-15, { duration: 180 }, () => {
        runOnJS(onDismiss)();
      });
    }, 4800);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value + index * 10 }],
    opacity: opacity.value,
  }));

  const themeColors = THEME[theme];
  const bgColor =
    toast.type === "error"
      ? themeColors.error
      : toast.type === "success"
        ? themeColors.success
        : toast.type === "info"
          ? themeColors.info
          : themeColors.primary;

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          marginBottom: 8,
          maxWidth: 420,
          width: width < 390 ? "100%" : "96%",
        },
      ]}
    >
      <Pressable
        onPress={onDismiss}
        style={{
          backgroundColor: bgColor,
          borderRadius: 16,
          padding: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Text
          style={{
            color: "#ffffff",
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 4,
          }}
        >
          {toast.title}
        </Text>
        <Text style={{ color: "#ffffff", fontSize: 14, opacity: 0.95 }}>
          {toast.message}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
