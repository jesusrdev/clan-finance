import React from "react";
import { describe, expect, it, vi } from "vitest";
import TestRenderer from "react-test-renderer";

function Subject({ label, testID }: { label: string; testID?: string }) {
  return <>{label}</>;
}

const renderSpy = vi.fn();

vi.mock("@/components/ui/toast", () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

vi.mock("@react-navigation/native", () => ({
  DefaultTheme: { dark: false, colors: { background: "#fff" } },
  DarkTheme: { dark: true, colors: { background: "#000" } },
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({ colors: { background: "#fff" } }),
}));

vi.mock("@testing-library/react-native", () => ({
  render: (ui: React.ReactElement, options: { wrapper: React.ComponentType<any> }) => {
    renderSpy(ui, options);
    const Wrapped = options.wrapper;
    const tree = TestRenderer.create(<Wrapped>{ui}</Wrapped>);

    return {
      getByTestId: (testID: string) => tree.root.findByProps({ testID }),
    };
  },
}));

import { renderWithProviders } from "./renderWithProviders";

describe("renderWithProviders", () => {
  it("auto-composes required providers", () => {
    renderWithProviders(<Subject testID="subject" label="ok" />);

    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(renderSpy.mock.calls[0][1].wrapper).toBeTypeOf("function");
  });

  it("prevents query cache leakage between sequential renders", () => {
    const first = renderWithProviders(<Subject label="first" />);
    first.queryClient.setQueryData(["leak-check"], "only-first");

    const second = renderWithProviders(<Subject label="second" />);

    expect(first.queryClient.getQueryData(["leak-check"])).toBe("only-first");
    expect(second.queryClient.getQueryData(["leak-check"])).toBeUndefined();
  });
});
