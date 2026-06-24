import { useNavigate, useParams } from "react-router";
import {
  getProjectDetail,
  type UpdateProjectRequest,
  updateProject,
  useApp,
} from "../components/context/context";
import { ProjectForm } from "../components/project/projectForm";

export function ProjectSettingsPage() {
  const navigate = useNavigate();
  const { pid } = useParams<{ pid: string }>();
  const { projects, setProjects } = useApp();

  const selectedProject = projects.find((project) => project.id === pid);
  const projectDetail = getProjectDetail(pid ?? "", projects);

  if (!selectedProject || !projectDetail) {
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
      projectId={selectedProject.projectId ?? selectedProject.id}
      headerTitle="프로젝트 설정 변경"
      initial={{
        title: selectedProject.title,
        description: selectedProject.projectDescription ?? "",
        participants: projectDetail.participants.map((participant) => ({
          id: participant.userId,
          title: participant.user.name,
          initials: participant.user.name.slice(0, 2),
          color: participant.color,
          email: participant.user.email,
          profileImage: participant.user.profileImage,
          projectMemberId: participant.projectMemberId,
          projectMemberRole: participant.projectMemberRole,
          projectMemberStatus: participant.projectMemberStatus,
          projectMemberGrade: participant.projectMemberGrade,
        })),
        notionUrl: selectedProject.notionUrl,
      }}
      submitLabel="완료"
      cancelLabel="취소"
      onCancel={() => navigate(`/projects/${pid}`)}
      onSubmit={({ title, description, participants, notionUrl }) => {
        const updatedTitle = title.trim();
        if (!updatedTitle) return;

        const payload: UpdateProjectRequest = {
          title: updatedTitle,
          description,
          participants: participants.map((participant, index) => {
            const existingParticipant = projectDetail.participants.find(
              (projectParticipant) => projectParticipant.userId === participant.id,
            );

            return {
              projectMemberId: participant.projectMemberId ?? existingParticipant?.projectMemberId,
              userId: participant.id,
              role: participant.projectMemberRole ?? existingParticipant?.projectMemberRole ?? (index === 0 ? "OWNER" : "MEMBER"),
              grade: participant.projectMemberGrade ?? existingParticipant?.projectMemberGrade ?? "MEMBER",
              status: participant.projectMemberStatus ?? existingParticipant?.projectMemberStatus ?? "ACTIVE",
            };
          }),
        };
        const result = updateProject(pid ?? "", payload, projects);
        if (!result) return;
        const updatedProject = { ...result.project, notionUrl };

        setProjects((previousProjects) =>
          previousProjects.map((project) =>
            project.id === updatedProject.id ? updatedProject : project,
          ),
        );
        navigate(`/projects/${pid}`);
      }}
    />
  );
}
