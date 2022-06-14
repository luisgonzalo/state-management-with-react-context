import React from "react";
import { models } from "powerbi-client";

export type WidgetState =
  | "idle"
  | "loading"
  | "rendering"
  | "rendered"
  | "failed";

type WidgetActionType =
  | "SET_CONFIG"
  | "ON_REPORT_LOADED"
  | "ON_REPORT_RENDERED"
  | "APPLY_FILTERS"
  | "ON_REPORT_ERROR"
  | "RETRY";

type WidgetConfig = {
  reportId?: string;
  token: string;
  embedUrl: string;
};

type WidgetFilters = models.IFilter[];

type WidgetReportError = {
  error: Error;
};

type WidgetAction = {
  type: WidgetActionType;
  payload?: WidgetConfig | WidgetFilters | WidgetReportError;
};

const widgetReducer = (
  state: WidgetState,
  action: WidgetAction
): WidgetState => {
  switch (action.type) {
    case "SET_CONFIG":
      if (state !== "idle") {
        console.log(`Cannot start loading if not in idle state`);
        return state;
      }
      return "loading";
    case "ON_REPORT_LOADED":
      return "rendering";
    case "ON_REPORT_ERROR":
      return "failed";
    case "ON_REPORT_RENDERED":
      return "rendered";
    case "APPLY_FILTERS":
      if (state !== "rendering" && state !== "rendered") {
        console.log(
          "Cannot apply filters if not in rendering or rendered state"
        );
        return state;
      }
      return "rendering";
    case "RETRY":
      if (state !== "failed") {
        console.log(`Cannot retry if not in failed state`);
        return state;
      }
      return "idle";
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const useWidgetState = () => {
  const context = React.useContext(WidgetContext);
  if (!context) {
    throw new Error(`useWidgetState must be used within a WidgetProvider`);
  }
  return context;
};

interface WidgetStateContext {
  state: WidgetState;
  reportConfig: models.IVisualEmbedConfiguration;
  setConfig: (config: WidgetConfig) => void;
  reportLoaded: () => void;
  reportError: () => void;
  reportRendered: () => void;
  applyFilters: (filters: WidgetFilters) => void;
  retry: () => void;
}

const defaultReportConfig: models.IVisualEmbedConfiguration = {
  type: "report",
  embedUrl: undefined,
  tokenType: models.TokenType.Embed,
  accessToken: undefined,
  visualName: "",
  settings: {
    panes: {
      filters: {
        expanded: false,
        visible: true,
      },
      pageNavigation: {
        visible: false,
      },
    },
    layoutType: models.LayoutType.Custom,
    customLayout: {
      displayOption: models.DisplayOption.FitToPage,
      pagesLayout: {},
    },
    background: models.BackgroundType.Transparent,
  },
  filters: [],
};

export const WidgetContext = React.createContext<WidgetStateContext>({
  state: "idle",
  reportConfig: defaultReportConfig,
  setConfig: () => {},
  reportLoaded: () => {},
  reportError: () => {},
  reportRendered: () => {},
  applyFilters: () => {},
  retry: () => {},
});

export const WidgetStateProvider = (props: any) => {
  const [state, dispatch] = React.useReducer(widgetReducer, "idle");
  const [reportConfig, setReportConfig] =
    React.useState<models.IVisualEmbedConfiguration>(defaultReportConfig);

  const setConfig = (config: WidgetConfig) => {
    dispatch({ type: "SET_CONFIG", payload: config });
    setReportConfig((reportConfig) => ({
      ...reportConfig,
      embedUrl: config.embedUrl,
      id: config.reportId,
      accessToken: config.token,
    }));
  };

  const reportLoaded = () => {
    dispatch({ type: "ON_REPORT_LOADED" });
  };

  const reportError = () => {
    dispatch({ type: "ON_REPORT_ERROR" });
  };

  const reportRendered = () => {
    dispatch({ type: "ON_REPORT_RENDERED" });
  };

  const applyFilters = (filters: WidgetFilters) => {
    dispatch({ type: "APPLY_FILTERS", payload: filters });
  };

  const retry = () => {
    dispatch({ type: "RETRY" });
  };

  const memoValue = React.useMemo<WidgetStateContext>(
    () => ({
      state,
      reportConfig,
      setConfig,
      reportLoaded,
      reportError,
      reportRendered,
      applyFilters,
      retry,
    }),
    [reportConfig, state]
  );
  return <WidgetContext.Provider value={memoValue} {...props} />;
};
