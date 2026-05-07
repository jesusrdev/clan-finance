import React from "react";
import { act, create } from "react-test-renderer";
import { beforeEach, describe, expect, it, vi } from "vitest";

const completeTaskMock = vi.fn(async () => undefined);
const toastShowMock = vi.fn();

let hookState: {
  isCompleting: boolean;
  lastErrorCode: "TASK_ALREADY_COMPLETED_IN_WINDOW" | null;
};

vi.mock("react-native", () => ({
  View: ({ children, ...props }: any) => React.createElement("ViewMock", props, children),
}));

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: () => ({ signOut: vi.fn() }),
}));

vi.mock("@/features/quests/hooks/useCompleteTask", () => ({
  useCompleteTask: () => ({
    completeTask: completeTaskMock,
    isCompleting: hookState.isCompleting,
    lastErrorCode: hookState.lastErrorCode,
  }),
}));

vi.mock("@/components/ui/toast", () => ({
  useToast: () => ({ show: toastShowMock }),
}));

vi.mock("@/components/ui/text", () => ({
  Text: ({ children, ...props }: any) => React.createElement("TextMock", props, children),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => React.createElement("ButtonMock", props, children),
}));

vi.mock("lucide-react-native", () => ({
  LogOut: () => React.createElement("IconMock", {}),
}));

import QuestsScreen from "./quests";

describe("QuestsScreen behavior", () => {
  beforeEach(() => {
    hookState = { isCompleting: false, lastErrorCode: null };
    toastShowMock.mockReset();
    completeTaskMock.mockClear();
  });

  it("muestra copy exacta de conflicto cuando llega TASK_ALREADY_COMPLETED_IN_WINDOW", async () => {
    hookState = {
      isCompleting: false,
      lastErrorCode: "TASK_ALREADY_COMPLETED_IN_WINDOW",
    };

    await act(async () => {
      create(<QuestsScreen />);
    });

    expect(toastShowMock).toHaveBeenCalledWith(
      "Misión ya completada",
      "Ya completaste esta tarea en este período.",
      "info",
    );
  });

  it("mantiene disabled el submit durante request in-flight", async () => {
    hookState = { isCompleting: true, lastErrorCode: null };

    let tree: ReturnType<typeof create> | null = null;
    await act(async () => {
      tree = create(<QuestsScreen />);
    });

    const buttons = tree!.root.findAll((node) => (node.type as any) === "ButtonMock");
    expect(buttons[0].props.disabled).toBe(true);

    const textNodes = tree!
      .root
      .findAll((node) => (node.type as any) === "TextMock")
      .map((node) => node.children.join(""));
    expect(textNodes).toContain("Completando...");
  });
});
