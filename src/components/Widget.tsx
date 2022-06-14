import { useEffect, useState } from "react";
import { PowerBIEmbed } from "powerbi-client-react";
import { models, Report, Embed } from "powerbi-client";
import { useWidgetState } from "../app-state/WidgetContext";
import "./Widget.css";

// API end-point url to get embed config for a sample report
const SAMPLE_REPORT_URL =
  "https://playgroundbe-bck-1.azurewebsites.net/Reports/SampleReport";

export const Widget = () => {
  const [message, setMessage] = useState<string>();
  const {
    state,
    reportConfig,
    setConfig,
    applyFilters,
    reportError,
    reportLoaded,
    reportRendered,
    retry,
  } = useWidgetState();

  // PowerBI Report object (to be received via callback)
  const [report, setReport] = useState<Report>();
  // Filter
  const [segment, setSegment] = useState<string>();

  // Fetch sample report's config (eg. embedUrl and AccessToken) for embedding
  const embedReport = async () => {
    // Fetch sample report's embed config
    const reportConfigResponse = await fetch(SAMPLE_REPORT_URL);

    if (!reportConfigResponse.ok) {
      console.error(
        `Failed to fetch config for report. Status: ${reportConfigResponse.status} ${reportConfigResponse.statusText}`
      );
      return;
    }

    const reportConfig = await reportConfigResponse.json();

    // Update display message
    setMessage(
      "The access token is successfully set. Loading the Power BI report"
    );

    // Set the fetched embedUrl and embedToken in the report config
    setConfig({
      embedUrl: reportConfig.EmbedUrl,
      token: reportConfig.EmbedToken.Token,
    });
  };

  // this effect applies the filter if state is 'rendering' or 'rendered' and the user changes filter
  useEffect(() => {
    if (state !== "rendering" && state !== "rendered") {
      return;
    }

    if (!segment) {
      return;
    }

    if (!report) {
      throw new Error(`Widget must have PowerBI Report object`);
    }

    const applyFiltersAsync = async (filters: models.IFilter[]) => {
      let pages = [];
      try {
        pages = await report.getPages();
      } catch (e) {
        console.log("Cannot load pages");
        return;
      }

      if (pages.length === 0) {
        console.log("No pages");
        return;
      }

      const page = pages[0];
      if (page) {
        applyFilters(filters);
        try {
          await page.removeFilters();
          await page.setFilters(filters);
        } catch (e) {
          console.log("Cannot apply filters: ", e);
        }
      } else {
        console.log("Page not found");
      }
    };

    const getSegmentFilter = (): models.ReportLevelFilters => ({
      $schema: "http://powerbi.com/product/schema#basic",
      target: {
        table: "Product",
        column: "Segment",
      },
      operator: "In",
      values: [segment],
      filterType: models.FilterType.Basic,
    });

    const doApplyFilters = async () => {
      const filters = [getSegmentFilter()];
      await applyFiltersAsync(filters);
    };

    doApplyFilters();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment]);

  // Map of event handlers to be applied to the embedding report
  // const eventHandlersMap = new Map<string, EventHandler>([
  //   [
  //     "loaded",
  //     function () {
  //       reportLoaded();
  //       setMessage("The report is loaded");
  //     },
  //   ],
  //   [
  //     "rendered",
  //     function () {
  //       reportRendered();
  //       setMessage("The report is rendered");
  //     },
  //   ],
  //   [
  //     "error",
  //     function (event?: service.ICustomEvent<any>) {
  //       if (event) {
  //         console.error(event.detail);
  //       }
  //       reportError();
  //     },
  //   ],
  // ]);

  report?.on("loaded", function (event) {
    report.off("loaded");
    console.log(event);
    reportLoaded();
  });
  report?.on("rendered", function (event) {
    console.log(event);
    reportRendered();
  });
  report?.on("error", function (event) {
    console.log(event);
    reportError();
  });

  return (
    <div>
      <PowerBIEmbed
        embedConfig={reportConfig}
        cssClassName={"report-style-class"}
        getEmbeddedComponent={(embedObject: Embed) =>
          setReport(embedObject as Report)
        }
      />
      <div className="hr"></div>

      <div className="displayMessage">{message}</div>
      <div className="displayMessage">Report state: {state}</div>

      <div className="controls">
        <button onClick={embedReport} disabled={state !== "idle"}>
          Embed Report
        </button>
        <select
          value={segment}
          placeholder="Select a segment"
          disabled={state !== "rendering" && state !== "rendered"}
          onChange={(e) => setSegment(e.target.value)}
        >
          <option value=""></option>
          <option value="All Season">All Season</option>
          <option value="Convenience">Convenience</option>
          <option value="Extreme">Extreme</option>
          <option value="Moderation">Moderation</option>
          <option value="Productivity">Productivity</option>
          <option value="Regular">Regular</option>
          <option value="Select">Select</option>
          <option value="Youth">Youth</option>
        </select>
        <button onClick={retry} disabled={state !== "failed"}>
          Retry
        </button>
      </div>
    </div>
  );
};
