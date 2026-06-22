import { createBrowserRouter } from "react-router";
import { RootPageLayout } from "../layouts/rootPageLayout";
import {
  HomePage,
  NewProjectPage,
  PausedPage,
  ProjectDetailPage,
  ProjectSettingsPage,
  RecordingPage,
  RecordingReadyPage,
  SummarizingPage,
  SummaryPage,
  UploadDonePage,
  UploadingPage,
  TextToAiPage,
} from "../pages";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootPageLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "projects/create", Component: NewProjectPage },
      { path: "projects/:pid", Component: ProjectDetailPage },
      { path: "projects/:pid/update", Component: ProjectSettingsPage },
      { path: "projects/:pid/record", Component: RecordingReadyPage },
      { path: "projects/:pid/record/active", Component: RecordingPage },
      { path: "projects/:pid/record/paused", Component: PausedPage },
      { path: "projects/:pid/record/summarizing", Component: SummarizingPage },
      { path: "projects/:pid/record/summary", Component: SummaryPage },
      { path: "projects/:pid/record/uploading", Component: UploadingPage },
      { path: "projects/:pid/record/done", Component: UploadDonePage },

      // 테스트 페이지 경로
      { path: "projects/:pid/text-to-ai", Component: TextToAiPage },
    ],
  },
]);
