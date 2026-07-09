import { Button } from "@/components/ui/Button";
import { colors } from "@/styles/theme";
import { Network, User } from "lucide-react";
import type { ReactNode } from "react";
import {
	AvatarCircle,
	AvatarWrap,
	EntryRow,
	EnvIcon,
	EnvRow,
	EnvSub,
	EnvText,
	EnvTitle,
	ListEntryIcon,
	ListEntryText,
	ScrollList,
	Section,
	SectionTitle,
	SidebarRoot,
	UserInfo,
	UserMeta,
	UserName,
} from "./ProfileSidebar.styles";
import { PROFILE_SIDEBAR_IDS } from "./ProfileSidebar.testids";

export interface ProfileInfo {
	name: string;
	id: string;
	organization: string;
}

export interface ListEntry {
	id: string;
	icon: ReactNode;
	label: string;
}

interface ProfileSidebarProps {
	profile: ProfileInfo;
	permissions: ListEntry[];
	departments: ListEntry[];
	onRequestEnvironment: () => void;
}

export const ProfileSidebar = ({
	profile,
	permissions,
	departments,
	onRequestEnvironment,
}: ProfileSidebarProps) => {
	return (
		<SidebarRoot data-testid={PROFILE_SIDEBAR_IDS.root}>
			<AvatarWrap>
				<AvatarCircle data-testid={PROFILE_SIDEBAR_IDS.avatar}>
					<User size={48} color={colors.surface} />
				</AvatarCircle>
			</AvatarWrap>

			<UserInfo data-testid={PROFILE_SIDEBAR_IDS.userInfo}>
				<UserName>{profile.name}</UserName>
				<UserMeta>ת.ז: {profile.id}</UserMeta>
				<UserMeta $noMargin>{profile.organization}</UserMeta>
			</UserInfo>

			<Section data-testid={PROFILE_SIDEBAR_IDS.permissions} $scroll>
				<SectionTitle>הרשאות</SectionTitle>
				<ScrollList>
					{permissions.map((p) => (
						<EntryRow
							data-testid={PROFILE_SIDEBAR_IDS.permissionEntry(p.id)}
							key={p.id}
						>
							<ListEntryIcon>{p.icon}</ListEntryIcon>
							<ListEntryText>{p.label}</ListEntryText>
						</EntryRow>
					))}
				</ScrollList>
			</Section>

			<Section data-testid={PROFILE_SIDEBAR_IDS.departments} $mt $scroll>
				<SectionTitle>אגפים</SectionTitle>
				<ScrollList>
					{departments.map((d) => (
						<EntryRow
							data-testid={PROFILE_SIDEBAR_IDS.departmentEntry(d.id)}
							key={d.id}
						>
							<ListEntryIcon>{d.icon}</ListEntryIcon>
							<ListEntryText>{d.label}</ListEntryText>
						</EntryRow>
					))}
				</ScrollList>
			</Section>

			<Section data-testid={PROFILE_SIDEBAR_IDS.env} $mt>
				<EnvRow>
					<EnvIcon>
						<Network size={16} />
					</EnvIcon>
					<EnvText>
						<EnvTitle>רוצה סביבה משלך?</EnvTitle>
						<EnvSub>ליצור ולערוך פקודות באופן עצמאי</EnvSub>
					</EnvText>
					<Button
						size="xs"
						data-testid={PROFILE_SIDEBAR_IDS.envButton}
						onClick={onRequestEnvironment}
					>
						שלח בקשה
					</Button>
				</EnvRow>
			</Section>
		</SidebarRoot>
	);
};
