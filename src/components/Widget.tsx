import { useEffect, useState } from "react";
import { PowerBIEmbed } from "powerbi-client-react";
import { Report, Embed } from "powerbi-client";
import { useWidgetState } from "../app-state/WidgetContext";
import { Button, Group, Text } from "@mantine/core";
import "./Widget.css";

// API end-point url to get embed config for a sample report
export const SAMPLE_REPORT_URL =
  "https://playgroundbe-bck-1.azurewebsites.net/Reports/SampleReport";

export const Widget = () => {
  const {
    state,
    reportConfig,
    setConfig,
    reportError,
    reportLoaded,
    reportRendered,
    retry,
  } = useWidgetState();

  // PowerBI Report object (to be received via callback)
  const [report, setReport] = useState<Report>();

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

    // Set the fetched embedUrl and embedToken in the report config
    setConfig({
      embedUrl: reportConfig.EmbedUrl,
      token: reportConfig.EmbedToken.Token,
    });
  };

  useEffect(() => {
    if (!report) return;

    report.on("loaded", function (event) {
      report.off("loaded");
      console.log(event);
      reportLoaded();
    });

    report.on("rendered", function (event) {
      console.log(event);
      reportRendered();
    });

    report.on("error", function (event) {
      console.log(event);
      reportError();
    });

    return () => {
      report.off("loaded");
      report.off("rendered");
      report.off("error");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report]);

  return (
    <div>
      <PowerBIEmbed
        embedConfig={reportConfig}
        cssClassName={"report-style-class"}
        getEmbeddedComponent={(embedObject: Embed) =>
          setReport(embedObject as Report)
        }
      />

      <Text>Report state: {state}</Text>

      <Group position="center">
        <Button onClick={embedReport} disabled={state !== "idle"}>
          Embed Report
        </Button>
        <Button onClick={retry} disabled={state !== "failed"}>
          Retry
        </Button>
      </Group>
    </div>
  );
};
