import { useNavigate } from "react-router";
import {
  PARTICIPANTS,
  type Project,
  useApp,
} from "../components/context/context";
import { ProjectForm } from "../components/project/projectForm";

export function NewProjectPage() {
  const navigate = useNavigate();
  const { setProjects } = useApp();

  return (
    <ProjectForm
      title="새로운 프로젝트"
      initial={{
        name: "",
        participants: [PARTICIPANTS[0], PARTICIPANTS[1]],
        notionUrl: "",
      }}
      submitLabel="회의 시작하기"
      cancelLabel="취소"
      onCancel={() => navigate("/")}
      onSubmit={({ name, participants, notionUrl }) => {
        const newProject: Project = {
          id: `p-${Date.now()}`,
          name: name || "새 프로젝트",
          participants,
          notionUrl,
          meetings: [],
        };

        setProjects((previousProjects) => [...previousProjects, newProject]);
        navigate(`/projects/${newProject.id}/record`);
      }}
    />
  );
}
