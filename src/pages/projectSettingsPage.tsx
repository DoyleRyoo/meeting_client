import { useNavigate, useParams } from "react-router";
import { useApp } from "../components/context/context";
import { ProjectForm } from "../components/project/projectForm";

export function ProjectSettingsPage() {
  const navigate = useNavigate();
  const { pid } = useParams<{ pid: string }>();
  const { projects, setProjects } = useApp();

  const selectedProject = projects.find((project) => project.id === pid);

  if (!selectedProject) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          프로젝트를 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  return (
    <ProjectForm
      headerTitle="프로젝트 설정 변경"
      initial={{
        title: selectedProject.title,
        participants: selectedProject.participants,
        notionUrl: selectedProject.notionUrl,
      }}
      submitLabel="완료"
      cancelLabel="취소"
      onCancel={() => navigate(`/projects/${pid}`)}
      onSubmit={({ title, participants, notionUrl }) => {
        setProjects((previousProjects) =>
          previousProjects.map((project) =>
            project.id === pid
              ? {
                  ...project,
                  title: title || project.title,
                  participants,
                  notionUrl,
                }
              : project,
          ),
        );
        navigate(`/projects/${pid}`);
      }}
    />
  );
}
